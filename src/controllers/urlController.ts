import { NextFunction, Request, Response } from "express"
import urlModel from "../models/urlModel"
import { generateShortCode, parseBulkShortenUrlsFile } from "../helpers/utils"
import { BulkShortenUrlObj, Url } from "../helpers/types"

const createShortUrl = async (req: Request, res: Response) => {
    const { originalUrl, expiryDate, customCode, password } = req.body
    const userId = (req as any).userId as number
    try {
        const lastIdDbRes = await urlModel.getLatestNUrls(1)
        let shortUrl = ""
        if (customCode) {
            shortUrl = customCode
        } else {
            shortUrl = generateShortCode((lastIdDbRes[0].id as number) + 1)
        }
        const createDbRes = await urlModel.create({
            originalUrl,
            shortUrl,
            userId,
            ...(expiryDate && { expiryDate }),
            ...(password && { password })
        })
        if (createDbRes.success) {
            return res.status(200).json({ success: true, shortUrl: (createDbRes.data as Url).shortUrl })
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
        await urlModel.updateUrl({ columns: { deletedAt: new Date() }, where: { originalUrl } })
        return res.status(200).json({ success: true, message: "URL deleted successfully." })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: err })
    }
}

const updateUrlMetaData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shortUrl = req.query.code as string
        const shortUrlRes = await urlModel.getByShortUrl({ shortUrl })
        await urlModel.updateUrl({
            columns: {
                visitCount: shortUrlRes[0].visitCount + 1,
                accessedAt: new Date(),
                shortUrl
            },
            where: { shortUrl }
        })
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const createBulkShortUrls = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId as number
        let urls: BulkShortenUrlObj[] = await parseBulkShortenUrlsFile(req.file as Express.Multer.File)
        const lastIdDbRes = await urlModel.getLatestNUrls(1)
        let latestIdCount = (lastIdDbRes[0].id as number)
        for (const url of urls) {
            if (!url.customCode) {
                url.customCode = generateShortCode(++latestIdCount)
            }
        }
        const resArr = await Promise.all(urls.map(url => urlModel.create({
            originalUrl: url.originalUrl,
            shortUrl: url.customCode,
            userId,
            ...(url.expiryDate && { expiryDate: url.expiryDate })
        })))
        return res.status(200).json({ success: true, message: resArr.filter(res => !res.success) })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const updateUrlExpiry = async (req: Request, res: Response) => {
    try {
        const code = req.query.code as string
        const expiryDate = req.body.expiryDate as Date
        const password = req.body.password as string
        await urlModel.updateUrl({
            columns: {
                expiryDate,
                shortUrl: code,
                ...(password && { password }),
            }, where: { shortUrl: code }
        })
        return res.status(200).json({ success: true, message: "URL expiry updated successfully" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const getUserUrls = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId)
        const urlRes = await urlModel.getByUserId({ userId })
        return res.status(200).json({ success: true, message: "URLs fetched successfully", data: urlRes })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

export default {
    createShortUrl,
    getOriginalUrl,
    deleteByOriginalUrl,
    updateUrlMetaData,
    createBulkShortUrls,
    updateUrlExpiry,
    getUserUrls,
}