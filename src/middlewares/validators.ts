import { Request, Response, NextFunction } from "express";
import urlModel from "../models/urlModel";

const validateShortenPayload = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { originalUrl } = req.body
        if (!originalUrl) {
            return res.status(400).json({ success: false, message: "Invalid or missing 'originalUrl' in request body." })
        }
        const originalUrlRes = await urlModel.getByOriginalUrl({ originalUrl })
        if (originalUrlRes.length) {
            return res.status(400).json({ success: false, shortUrl: originalUrlRes[0].shortUrl, message: "This URL has already been shortened." })
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
        if (!shortUrl) return res.status(400).json({ success: false, message: "Missing or empty required query parameter 'code'." })
        const shortUrlRes = await urlModel.getByShortUrl({ shortUrl })
        if (shortUrlRes.length === 0) return res.status(400).json({ success: false, message: "No URL found for the provided code." })
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const validateDeleteParams = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const originalUrl = req.query.originalUrl
        if (!originalUrl) return res.status(400).json({ success: false, message: "Missing or empty required parameter 'originalUrl'." })
        const originalUrlRes = await urlModel.getByOriginalUrl({ originalUrl: originalUrl as string })
        if (originalUrlRes.length === 0) return res.status(400).json({ success: false, message: "This URL is not shortened yet." })
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
}