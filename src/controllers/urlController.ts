import { Request, Response } from "express"
import urlModel from "../models/urlModel"
import { generateShortCode } from "../helpers/utils"

const createShortUrl = (req: Request, res: Response) => {
    const { originalUrl } = req.body
    urlModel.getLastUrlId((err, queryObj) => {
        if (err) {
            console.error("Error while fetching total counts", err)
        } else {
            const shortUrl = generateShortCode(queryObj.id + 1)
            urlModel.create({ originalUrl, shortUrl }, (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: err })
                } else {
                    return res.status(200).json({ success: true, shortUrl })
                }
            })
        }
    })
}

const getOriginalUrl = (req: Request, res: Response) => {
    const code = req.query.code as string
    if (!code) return res.status(400).json({ success: false, message: "Missing required query parameter: code" })
    urlModel.getByShortUrl(code, (err, queryRes) => {
        if (err) {
            return res.status(500).json({ success: false, message: err })
        } else {
            return res.status(200).json({ success: true, originalUrl: queryRes.original_url, createdAt: queryRes.created_at })
        }
    })
}

export default {
    createShortUrl,
    getOriginalUrl,
}