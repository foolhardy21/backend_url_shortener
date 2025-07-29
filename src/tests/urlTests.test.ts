import supertest from "supertest"
import app from "../.."
import urlModel from "../models/urlModel"

describe("URL Integration Testing", () => {
    const originalUrl = "https://example.com"

    beforeAll(() => {
        urlModel.deleteByOriginalUrl(originalUrl, () => { })
    })

    it("should create the short url and redirect to it's original url", async () => {
        const body = { originalUrl }
        const shortenRes = await supertest(app)
            .post("/api/url/shorten")
            .send(body)
        expect(shortenRes.status).toBe(200)
        expect(shortenRes.body.success).toBeTruthy()

        const redirectRes = await supertest(app)
            .get(`/api/url/redirect?code=${shortenRes.body.shortUrl}`)

        expect(redirectRes.status).toBe(200)
        expect(redirectRes.body.success).toBeTruthy()
        expect(redirectRes.body.originalUrl).toBe(body.originalUrl)

    })
})