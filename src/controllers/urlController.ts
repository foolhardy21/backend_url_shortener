import { Request, Response } from "express"
import urlModel from "../models/urlModel"
import { generateShortCode } from "../helpers/utils"
import { Url } from "../helpers/types"

const createShortUrl = async (req: Request, res: Response) => {
    const { originalUrl } = req.body
    try {
        const lastIdDbRes = await urlModel.getLastUrlId()
        const shortUrl = generateShortCode((lastIdDbRes as number) + 1)
        const createDbRes = await urlModel.create({ originalUrl, shortUrl })
        if (createDbRes) {
            return res.status(200).json({ success: true, shortUrl: (createDbRes as Url).shortUrl })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const getOriginalUrl = async (req: Request, res: Response) => {
    const code = req.query.code as string
    try {
        const shortUrlRes = await urlModel.getByShortUrl({ shortUrl: code })
        if (shortUrlRes) {
            return res.status(200).json({ success: true, originalUrl: shortUrlRes[0].originalUrl, createdAt: shortUrlRes[0].createdAt })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const deleteByOriginalUrl = async (req: Request, res: Response) => {
    try {
        const originalUrl = req.query.originalUrl as string
        await urlModel.deleteByOriginalUrl({ originalUrl })
        return res.status(200).json({ success: true, message: "URL deleted successfully." })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: err })
    }
}

export default {
    createShortUrl,
    getOriginalUrl,
    deleteByOriginalUrl,
}