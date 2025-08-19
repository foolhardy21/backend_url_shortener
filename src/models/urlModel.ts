import { Sequelize, WhereOptions } from "sequelize"
import db from "../db/database"
import { Url } from "../helpers/types"

const getTotalUrlsCount = async (): Promise<number> => {
    try {
        const dbRes = await db.get({
            where: {},
            options: {},
        })
        return dbRes.length
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const create = async (urlObj: { originalUrl: string, shortUrl: string, userId: number, expiryDate?: Date, password?: string }): Promise<{ success: boolean, data: Url | Error }> => {
    try {
        const dbRes = await db.create({
            originalUrl: urlObj.originalUrl,
            shortUrl: urlObj.shortUrl,
            userId: urlObj.userId,
            ...(urlObj.expiryDate && { expiryDate: urlObj.expiryDate }),
            ...(urlObj.password && { password: urlObj.password }),
        })
        return { success: true, data: dbRes }
    } catch (err) {
        console.log(err)
        return { success: false, data: err as Error }
    }
}

const getByShortUrl = async ({ shortUrl }: { shortUrl: string }): Promise<Url[]> => {
    try {
        const dbRes = await db.get({
            where: {
                shortUrl
            },
            options: {},
        })
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const getByOriginalUrl = async ({ originalUrl }: { originalUrl: string }): Promise<Url[]> => {
    try {
        const dbRes = await db.get({
            where: {
                originalUrl
            },
            options: {},
        })
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const deleteByOriginalUrl = async ({ originalUrl }: { originalUrl: string }): Promise<number> => {
    try {
        const dbRes = await db.delete({
            where: {
                originalUrl
            }
        })
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const getLatestNUrls = async (limit: number): Promise<Url[]> => {
    try {
        const dbRes = await db.get({
            where: {},
            options: {
                order: [["created_at", "DESC"]],
                limit,
            }
        })
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const getPopularNUrls = async (limit: number) => {
    try {
        const dbRes = await db.get({
            where: {},
            options: {
                order: [["visit_count", "DESC"], ["accessed_at", "DESC"]],
                limit,
            }
        })
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const getMostShortenedNUrls = async (limit: number) => {
    try {
        const dbRes = await db.get({
            where: {},
            options: {
                attributes: ["original_url", [Sequelize.fn("COUNT", Sequelize.col("original_url")), "shortened_url"]],
                group: "original_url",
                order: [["shortened_url", "DESC"]],
                limit,
            }
        })
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const updateUrl = async ({ columns, where }: { columns: Record<string, unknown>, where: WhereOptions }): Promise<number[]> => {
    try {
        const dbRes = await db.update(columns, { where })
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const getByPassword = async ({ password }: { password: string }): Promise<Url[]> => {
    try {
        const dbRes = await db.get({
            where: { password },
            options: {}
        })
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const getByUserId = async ({ userId }: { userId: number }): Promise<Url[]> => {
    try {
        const dbRes = await db.get({
            where: { userId },
            options: {}
        })
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

export default {
    getTotalUrlsCount,
    create,
    getByShortUrl,
    deleteByOriginalUrl,
    getByOriginalUrl,
    getLatestNUrls,
    getPopularNUrls,
    getMostShortenedNUrls,
    updateUrl,
    getByPassword,
    getByUserId,
}