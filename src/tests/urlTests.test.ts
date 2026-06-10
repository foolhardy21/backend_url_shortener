import supertest from "supertest"
import app from "../.."
import urlModel from "../models/urlModel"
import { RATE_LIMIT } from "../helpers/utils"
import cache from "../db/cache"
import database from "../db/database"

const mockGetByShortUrl = jest.spyOn(urlModel, "getByShortUrl")

afterAll(async () => {
    await cache.disconnect()
    await database.close()
})

describe("URL Integration Testing", () => {
    const originalUrl = "https://example.com"
    const body = { originalUrl }

    beforeEach(async () => {
        await supertest(app)
            .delete(`/api/url?originalUrl=${originalUrl}`)
            .set("x-api-key", process.env.TEST_API_KEY as string)
        await cache.flush()
    })

    it("should create the short url and redirect to it's original url", async () => {
        const shortenRes = await supertest(app)
            .post("/api/url/shorten")
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .send(body)
        expect(shortenRes.status).toBe(200)
        expect(shortenRes.body.success).toBeTruthy()

        const redirectRes = await supertest(app)
            .patch(`/api/url/redirect?code=${shortenRes.body.shortUrl}`)

        expect(redirectRes.status).toBe(200)
        expect(redirectRes.body.success).toBeTruthy()
        expect(redirectRes.body.originalUrl).toBe(body.originalUrl)

    })

    it("can create duplicate urls", async () => {
        const shortenRes = await supertest(app)
            .post("/api/url/shorten")
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .send(body)
        expect(shortenRes.status).toBe(200)
        expect(shortenRes.body.success).toBeTruthy()

        const shortenDuplicateRes = await supertest(app)
            .post("/api/url/shorten")
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .send(body)
        expect(shortenDuplicateRes.status).toBe(200)
        expect(shortenDuplicateRes.body.success).toBeTruthy()
        expect(shortenDuplicateRes.body.shortUrl).not.toBe(shortenRes.body.shortUrl)
    })

    it("should not redirect for unknown code", async () => {
        const shortenRes = await supertest(app)
            .post("/api/url/shorten")
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .send(body)
        expect(shortenRes.status).toBe(200)
        expect(shortenRes.body.success).toBeTruthy()

        const deleteRes = await supertest(app)
            .delete(`/api/url?originalUrl=${originalUrl}`)
            .set("x-api-key", process.env.TEST_API_KEY as string)
        expect(deleteRes.status).toBe(200)
        expect(deleteRes.body.success).toBeTruthy()

        const redirectRes = await supertest(app)
            .patch(`/api/url/redirect?code=${shortenRes.body.shortUrl}`)
        expect(redirectRes.status).toBe(400)
        expect(redirectRes.body.success).toBeFalsy()
    })

    it("should throw error without API key", async () => {
        const shortenRes = await supertest(app)
            .post("/api/url/shorten")
            .send(body)
        expect(shortenRes.status).toBe(401)
        expect(shortenRes.body.success).toBeFalsy()

        const deleteRes = await supertest(app)
            .delete(`/api/url?originalUrl=${originalUrl}`)
        expect(deleteRes.status).toBe(401)
        expect(deleteRes.body.success).toBeFalsy()
    })

    it("should throw error for expired urls", async () => {
        const shortenRes = await supertest(app)
            .post("/api/url/shorten")
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .send({ ...body, expiryDate: new Date() })
        expect(shortenRes.status).toBe(200)
        expect(shortenRes.body.success).toBeTruthy()

        const redirectRes = await supertest(app)
            .patch(`/api/url/redirect?code=${shortenRes.body.shortUrl}`)
        expect(redirectRes.status).toBe(403)
        expect(redirectRes.body.success).toBeFalsy()
    })

    it("should not accept duplicate custom code", async () => {
        const shortenRes = await supertest(app)
            .post("/api/url/shorten")
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .send({ ...body, customCode: "1" })
        expect(shortenRes.status).toBe(409)
        expect(shortenRes.body.success).toBeFalsy()
    })

    it("should not accept non unique custom code", async () => {
        const shortenRes = await supertest(app)
            .post("/api/url/shorten")
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .send({ ...body, customCode: "hocuspocus" })
        expect(shortenRes.status).toBe(409)
        expect(shortenRes.body.success).toBeFalsy()
    })

    it("should validate user's tier for bulk shorten", async () => {
        const response = await supertest(app)
            .post("/api/url/bulk-shorten")
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .attach("urlsCsv", "src/tests/fixtures/bulk_shorten_urls.csv")
        expect(response.status).toBe(401)
        expect(response.body.success).toBeFalsy()
    })

    it("should validate bulk shorten csv file", async () => {
        const response = await supertest(app)
            .post("/api/url/bulk-shorten")
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .attach("urlsCsv", "src/tests/fixtures/bulk_shorten_urls.csv")
        expect(response.status).toBe(401)
        expect(response.body.success).toBeFalsy()
    })

    it("should edit url's expiry date", async () => {
        const shortenRes = await supertest(app)
            .post("/api/url/shorten")
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .send(body)
        expect(shortenRes.status).toBe(200)
        expect(shortenRes.body.success).toBeTruthy()

        const response = await supertest(app)
            .patch(`/api/url/update?code=${shortenRes.body.shortUrl}`)
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .send({ ...body, expiryDate: new Date() })
        expect(response.status).toBe(200)
        expect(response.body.success).toBeTruthy()
    })

    it("should validate urls's password", async () => {
        const uniquePassword = `password_${Date.now()}`
        const shortenRes = await supertest(app)
            .post("/api/url/shorten")
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .send({ ...body, password: uniquePassword })
        expect(shortenRes.status).toBe(200)
        expect(shortenRes.body.success).toBeTruthy()

        const failedRedirectRes = await supertest(app)
            .patch(`/api/url/redirect?code=${shortenRes.body.shortUrl}`)
            .send({ password: "televisionn" })
        expect(failedRedirectRes.status).toBe(403)
        expect(failedRedirectRes.body.success).toBeFalsy()


        const redirectRes = await supertest(app)
            .patch(`/api/url/redirect?code=${shortenRes.body.shortUrl}`)
            .send({ password: uniquePassword })
        expect(redirectRes.status).toBe(200)
        expect(redirectRes.body.success).toBeTruthy()
    })

    it("should fetch all the urls of the user", async () => {
        const getUserUrlsRes = await supertest(app)
            .get("/api/url/user/4")
        expect(getUserUrlsRes.status).toBe(200)
        expect(getUserUrlsRes.body.success).toBeTruthy()
    })

    it("should not allow blacklisted users", async () => {
        const shortenRes = await supertest(app)
            .post("/api/url/shorten")
            .set("x-api-key", process.env.BLACKLIST_TEST_API_KEY as string)
            .send({ ...body, password: "password3" })
        expect(shortenRes.status).toBe(403)
        expect(shortenRes.body.success).toBeFalsy()
    })

    it("should use cache for redirects", async () => {
        mockGetByShortUrl.mockClear()
        const shortenRes = await supertest(app)
            .post("/api/url/shorten")
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .send({ ...body })
        expect(shortenRes.status).toBe(200)
        expect(shortenRes.body.success).toBeTruthy()

        const redirectRes = await supertest(app)
            .patch(`/api/url/redirect?code=${shortenRes.body.shortUrl}`)
        expect(redirectRes.status).toBe(200)
        expect(redirectRes.body.success).toBeTruthy()

        const redirect2Res = await supertest(app)
            .patch(`/api/url/redirect?code=${shortenRes.body.shortUrl}`)
        expect(redirect2Res.status).toBe(200)
        expect(redirect2Res.body.success).toBeTruthy()
        expect(mockGetByShortUrl).toHaveBeenCalledTimes(1)
    })

    it("should limit the requests to a limit", async () => {
        // Pre-seed the rate limit counter in Redis to just below the threshold
        const shortenRes = await supertest(app)
            .post("/api/url/shorten")
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .send({ ...body })
        expect(shortenRes.status).toBe(200)
        expect(shortenRes.body.success).toBeTruthy()

        const cacheKey = `redirect+::ffff:127.0.0.1`
        // Set counter to just below RATE_LIMIT.REDIRECT
        await cache.set(cacheKey, String(RATE_LIMIT.REDIRECT - 1))
        await cache.expire(cacheKey, 60)

        const redirectRes = await supertest(app)
            .patch(`/api/url/redirect?code=${shortenRes.body.shortUrl}`)
        expect(redirectRes.status).toBe(429)
        expect(redirectRes.body.success).toBeFalsy()
    })
})