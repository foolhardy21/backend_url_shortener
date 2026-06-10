import { NextFunction, Request, Response } from "express"
import urlModel from "../models/urlModel"
import { generateShortCode, parseBulkShortenUrlsFile } from "../helpers/utils"
import { BulkShortenUrlObj, Url } from "../helpers/types"
import cache from "../db/cache"

const createShortUrl = async (req: Request, res: Response) => {
    const { originalUrl, expiryDate, customCode, password } = req.body
    const userId = (req as unknown as { userId: number }).userId
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
            res.set("Cache-Control", "max-age=86400")
            return res.status(200).json({ success: true, shortUrl: (createDbRes.data as Url).shortUrl })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const getOriginalUrl = async (req: Request, res: Response) => {
    const url = (req as unknown as { urlObj: Url }).urlObj
    try {
        return res.status(200).json({ success: true, originalUrl: url.originalUrl, createdAt: url.createdAt })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const deleteByOriginalUrl = async (req: Request, res: Response) => {
    try {
        const url = (req as unknown as { urlObj: Url }).urlObj
        const deletedAt = new Date()
        url.deletedAt = deletedAt
        await urlModel.updateUrl({ columns: { deletedAt: deletedAt }, where: { originalUrl: url.originalUrl } })
        await cache.set(url.shortUrl, JSON.stringify(url))
        return res.status(200).json({ success: true, message: "URL deleted successfully." })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ status: false, message: err })
    }
}

const updateUrlMetaData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const url = (req as unknown as { urlObj: Url }).urlObj
        url.visitCount = Number(url.visitCount) + 1
        await cache.set(url.shortUrl, JSON.stringify(url))
        await urlModel.updateUrl({
            columns: {
                visitCount: url.visitCount,
                accessedAt: new Date(),
                shortUrl: url.shortUrl,
            },
            where: { shortUrl: url.shortUrl }
        })
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const createBulkShortUrls = async (req: Request, res: Response) => {
    try {
        const userId = (req as unknown as { userId: number }).userId
        const lastIdDbRes = await urlModel.getLatestNUrls(1)
        let latestIdCount = (lastIdDbRes[0].id as number)
        const urls: BulkShortenUrlObj[] = await parseBulkShortenUrlsFile(req.file as Express.Multer.File)
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
        const url = (req as unknown as { urlObj: Url }).urlObj
        const code = req.query.code as string
        const expiryDate = req.body.expiryDate as Date
        const password = req.body.password as string
        url.expiryDate = expiryDate
        url.password = password
        await urlModel.updateUrl({
            columns: {
                expiryDate,
                shortUrl: code,
                ...(password && { password }),
            }, where: { shortUrl: code }
        })
        await cache.set(url.shortUrl, JSON.stringify(url))
        return res.status(200).json({ success: true, message: "URL expiry updated successfully" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

const getUserUrls = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId)
        const page = Number(req.query?.page) || 1
        const size = Number(req.query?.size) || 10
        const urlRes = await urlModel.getByUserId({ userId, page, size })
        return res.status(200).json({ success: true, message: "URLs fetched successfully", countPerPage: size, hasNext: urlRes.length > size, data: urlRes })
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