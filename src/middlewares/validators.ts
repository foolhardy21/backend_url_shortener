import { Request, Response, NextFunction } from "express";
import urlModel from "../models/urlModel";
import userModel from "../models/userModel";

const isApiKeyValid = async (requestApiKey: string) => {
    try {
        if (!requestApiKey) {
            return { success: false, message: "Missing API key." }
        }
        const userRes = await userModel.getUserByApiKey(requestApiKey as string)
        if (userRes.length === 0) {
            return { success: false, message: "Invalid API key." }
        }
        return { success: true, userId: userRes[0].id }
    } catch (err) {
        console.log(err)
        return { success: false, message: err }
    }
}

const validateShortenPayload = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { originalUrl, customCode } = req.body
        const requestApiKey = req.headers["x-api-key"]
        if (!originalUrl) {
            return res.status(400).json({ success: false, message: "Invalid or missing 'originalUrl' in request body." })
        }
        const apiKeyValidity = await isApiKeyValid(requestApiKey as string)
        if (!apiKeyValidity.success) return res.status(401).json(apiKeyValidity)
        if (customCode) {
            const urlRes = await urlModel.getByShortUrl({ shortUrl: customCode })
            if (urlRes.length > 0) return res.status(409).json({ success: false, message: "This short URL already exists. Please create a new one." })
        }
        (req as any).userId = apiKeyValidity.userId
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const validateRedirectQuery = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shortUrl = req.query.code as string
        if (!shortUrl) return res.status(400).json({ success: false, message: "Missing or empty required query parameter 'code'." })
        const shortUrlRes = await urlModel.getByShortUrl({ shortUrl })
        if (shortUrlRes[0].deletedAt) return res.status(400).json({ success: false, message: "No URL found for the provided code." })
        if (shortUrlRes[0].expiryDate) {
            const expiryDate = new Date(shortUrlRes[0].expiryDate as string)
            if (expiryDate < new Date()) {
                return res.status(403).json({ success: false, message: "This short URL has expired. Please create a new one ot continue." })
            }
        }
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const validateDeleteParams = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const originalUrl = req.query.originalUrl
        const requestApiKey = req.headers["x-api-key"]
        if (!originalUrl) return res.status(400).json({ success: false, message: "Missing or empty required parameter 'originalUrl'." })
        const originalUrlRes = await urlModel.getByOriginalUrl({ originalUrl: originalUrl as string })
        if (originalUrlRes.length === 0) return res.status(401).json({ success: false, message: "This URL is not shortened yet." })

        const apiKeyValidity = await isApiKeyValid(requestApiKey as string)
        if (!apiKeyValidity.success) return res.status(401).json(apiKeyValidity)
        if (originalUrlRes[0].userId !== apiKeyValidity.userId) {
            return res.status(403).json({ success: false, message: "You do not have the permission to delete this url" })
        }
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const validateBulkShortenPayload = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestApiKey = req.headers["x-api-key"]
        const apiKeyValidity = await isApiKeyValid(requestApiKey as string)
        if (!apiKeyValidity.success) return res.status(401).json(apiKeyValidity)
        if (!req.file) return res.status(400).json({ success: false, message: "File is missing" })
        if (req.file.mimetype != "text/csv") return res.status(400).json({ success: false, message: "The file sent is not a CSV" });
        (req as any).userId = apiKeyValidity.userId
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

export default {
    validateShortenPayload,
    validateRedirectQuery,
    validateDeleteParams,
    validateBulkShortenPayload,
}