import supertest from "supertest"
import app from "../.."

describe("URL Integration Testing", () => {
    const originalUrl = "https://example.com"
    const body = { originalUrl }

    beforeEach(async () => {
        await supertest(app)
            .delete(`/api/url?originalUrl=${originalUrl}`)
            .set("x-api-key", process.env.TEST_API_KEY as string)
    })

    it("should create the short url and redirect to it's original url", async () => {
        const shortenRes = await supertest(app)
            .post("/api/url/shorten")
            .set("x-api-key", process.env.TEST_API_KEY as string)
            .send(body)
        expect(shortenRes.status).toBe(200)
        expect(shortenRes.body.success).toBeTruthy()

        const redirectRes = await supertest(app)
            .get(`/api/url/redirect?code=${shortenRes.body.shortUrl}`)

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
            .get(`/api/url/redirect?code=${shortenRes.body.shortUrl}`)
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
            .get(`/api/url/redirect?code=${shortenRes.body.shortUrl}`)
        expect(redirectRes.status).toBe(403)
        expect(redirectRes.body.success).toBeFalsy()
    })
})