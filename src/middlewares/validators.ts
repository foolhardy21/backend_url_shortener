import { Request, Response, NextFunction } from "express";
import urlModel from "../models/urlModel";
import userModel from "../models/userModel";

const validateShortenPayload = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { originalUrl, customCode, password } = req.body
        if (!originalUrl) {
            return res.status(400).json({ success: false, message: "Invalid or missing 'originalUrl' in request body." })
        }
        if (customCode) {
            const urlRes = await urlModel.getByShortUrl({ shortUrl: customCode })
            if (urlRes.length > 0) return res.status(409).json({ success: false, message: "This short URL already exists. Please create a new one." })
            if (!urlRes[0].deletedAt) return res.status(409).json({ success: false, message: "This short URL already exists. Please create a new one." })
        }
        if (password) {
            const urlPassRes = await urlModel.getByPassword({ password })
            if (urlPassRes.length > 0) return res.status(401).json({ success: false, message: "This password already exists. Please create a new one." })
        }
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const validateRedirectQuery = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shortUrl = req.query.code as string
        const password = (req.body?.password || "") as string
        if (!shortUrl) return res.status(400).json({ success: false, message: "Missing or empty required query parameter 'code'." })
        const shortUrlRes = await urlModel.getByShortUrl({ shortUrl })
        if (shortUrlRes[0].deletedAt) return res.status(400).json({ success: false, message: "No URL found for the provided code." })
        if (shortUrlRes[0].expiryDate) {
            const expiryDate = new Date(shortUrlRes[0].expiryDate as string)
            if (expiryDate < new Date()) {
                return res.status(403).json({ success: false, message: "This short URL has expired. Please create a new one ot continue." })
            }
        }
        if (password) {
            const urlPassRes = await urlModel.getByPassword({ password })
            if (urlPassRes.length < 1) return res.status(403).json({ success: false, message: "This password does not exist." })
            if (urlPassRes[0].password !== shortUrlRes[0].password) return res.status(403).json({ success: false, message: "Incorrect password for the specified URL." })
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
        const apiKeyUserId = (req as any).user.id
        if (!originalUrl) return res.status(400).json({ success: false, message: "Missing or empty required parameter 'originalUrl'." })
        const originalUrlRes = await urlModel.getByOriginalUrl({ originalUrl: originalUrl as string })
        if (originalUrlRes.length === 0) return res.status(401).json({ success: false, message: "This URL is not shortened yet." })

        if (originalUrlRes[0].userId != apiKeyUserId) {
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
        if (!req.file) return res.status(400).json({ success: false, message: "File is missing" })
        if (req.file.mimetype != "text/csv") return res.status(400).json({ success: false, message: "The file sent is not a CSV" });
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const validateUpdateQuery = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shortUrl = req.query.code as string
        const password = (req.body?.password || "") as string
        if (!shortUrl) return res.status(400).json({ success: false, message: "Missing or empty required query parameter 'code'." })
        const shortUrlRes = await urlModel.getByShortUrl({ shortUrl })
        if (shortUrlRes[0].deletedAt) return res.status(400).json({ success: false, message: "No URL found for the provided code." })
        if (shortUrlRes[0].expiryDate) {
            const expiryDate = new Date(shortUrlRes[0].expiryDate as string)
            if (expiryDate < new Date()) {
                return res.status(403).json({ success: false, message: "This short URL has expired. Please create a new one ot continue." })
            }
        }
        if (password) {
            const urlPassRes = await urlModel.getByPassword({ password })
            if (urlPassRes.length > 0) return res.status(401).json({ success: false, message: "This password already exists. Please create a new one." })
        }
        next()
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const validateGetUserUrls = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = Number(req.params.userId)
        const userRes = await userModel.getUserById({ userId: userId })
        if (userRes.length === 0) return res.status(403).json({ success: false, message: "This user does not exist." })
        next()
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

export default {
    validateShortenPayload,
    validateRedirectQuery,
    validateDeleteParams,
    validateBulkShortenPayload,
    validateUpdateQuery,
    validateGetUserUrls
}