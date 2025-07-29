import { Request, Response } from "express"
import urlModel from "../models/urlModel"
import { generateShortCode } from "../helpers/utils"

const createShortUrl = (req: Request, res: Response) => {
    const { originalUrl } = req.body

    urlModel.getTotalUrlsCount((err, queryObj) => {
        if (err) {
            console.error("Error while fetching total counts", err)
        } else {
            const shortUrl = generateShortCode(queryObj.count + 1)
            urlModel.create({ originalUrl, shortUrl }, (err) => {
                if (err) {
                    return res.status(400).json({ success: false, message: err })
                } else {
                    return res.status(200).json({ success: true, shortUrl })
                }
            })
        }
    })
}

export default {
    createShortUrl,
}