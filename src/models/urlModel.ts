import { Sequelize, WhereOptions } from "sequelize"
import db from "../db/database"
import { Url } from "../helpers/types"
import { BACKOFF_RETRIES, backoffRetries } from "../helpers/utils"

const getTotalUrlsCount = async (): Promise<number> => {
    try {
        const boundGet = db.get.bind(db, {
            where: {},
            options: {},
        })
        const dbRes = await backoffRetries(boundGet, BACKOFF_RETRIES.COUNT, BACKOFF_RETRIES.INITIAL_DELAY)
        return dbRes.length
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const create = async (urlObj: { originalUrl: string, shortUrl: string, userId: number, expiryDate?: Date, password?: string }): Promise<{ success: boolean, data: Url | Error }> => {
    try {
        const boundCreate = db.create.bind(db, {
            originalUrl: urlObj.originalUrl,
            shortUrl: urlObj.shortUrl,
            userId: urlObj.userId,
            ...(urlObj.expiryDate && { expiryDate: urlObj.expiryDate }),
            ...(urlObj.password && { password: urlObj.password }),
        })
        const dbRes = await backoffRetries(boundCreate, BACKOFF_RETRIES.COUNT, BACKOFF_RETRIES.INITIAL_DELAY)
        return { success: true, data: dbRes }
    } catch (err) {
        console.log(err)
        return { success: false, data: err as Error }
    }
}

const getByShortUrl = async ({ shortUrl }: { shortUrl: string }): Promise<Url[]> => {
    try {
        const boundGet = db.get.bind(db, {
            where: {
                shortUrl
            },
            options: {},
        })
        const dbRes = await backoffRetries(boundGet, BACKOFF_RETRIES.COUNT, BACKOFF_RETRIES.INITIAL_DELAY)
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const getByOriginalUrl = async ({ originalUrl }: { originalUrl: string }): Promise<Url[]> => {
    try {
        const boundGet = db.get.bind(db, {
            where: {
                originalUrl
            },
            options: {},
        })
        const dbRes = await backoffRetries(boundGet, BACKOFF_RETRIES.COUNT, BACKOFF_RETRIES.INITIAL_DELAY)
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const deleteByOriginalUrl = async ({ originalUrl }: { originalUrl: string }): Promise<number> => {
    try {
        const boundDelete = db.delete.bind(db, {
            where: {
                originalUrl
            }
        })
        const dbRes = await backoffRetries(boundDelete, BACKOFF_RETRIES.COUNT, BACKOFF_RETRIES.INITIAL_DELAY)
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const getLatestNUrls = async (limit: number): Promise<Url[]> => {
    try {
        const boundGet = db.get.bind(db, {
            where: {},
            options: {
                order: [["created_at", "DESC"]],
                limit,
            }
        })
        const dbRes = await backoffRetries(boundGet, BACKOFF_RETRIES.COUNT, BACKOFF_RETRIES.INITIAL_DELAY)
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const getPopularNUrls = async (limit: number) => {
    try {
        const boundGet = db.get.bind(db, {
            where: {},
            options: {
                order: [["visit_count", "DESC"], ["accessed_at", "DESC"]],
                limit,
            }
        })
        const dbRes = await backoffRetries(boundGet, BACKOFF_RETRIES.COUNT, BACKOFF_RETRIES.INITIAL_DELAY)
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const getMostShortenedNUrls = async (limit: number) => {
    try {
        const boundGet = db.get.bind(db, {
            where: {},
            options: {
                attributes: ["original_url", [Sequelize.fn("COUNT", Sequelize.col("original_url")), "shortened_url"]],
                group: "original_url",
                order: [["shortened_url", "DESC"]],
                limit,
            }
        })
        const dbRes = await backoffRetries(boundGet, BACKOFF_RETRIES.COUNT, BACKOFF_RETRIES.INITIAL_DELAY)
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const updateUrl = async ({ columns, where }: { columns: Record<string, unknown>, where: WhereOptions }): Promise<number[]> => {
    try {
        const boundUpdate = db.update.bind(db, columns, { where })
        const dbRes = await backoffRetries(boundUpdate, BACKOFF_RETRIES.COUNT, BACKOFF_RETRIES.INITIAL_DELAY)
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const getByPassword = async ({ password }: { password: string }): Promise<Url[]> => {
    try {
        const boundGet = db.get.bind(db, {
            where: { password },
            options: {}
        })
        const dbRes = await backoffRetries(boundGet, BACKOFF_RETRIES.COUNT, BACKOFF_RETRIES.INITIAL_DELAY)
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const getByUserId = async ({ userId, page = 1, size = 10 }: { userId: number, page?: number, size?: number }): Promise<Url[]> => {
    try {
        const boundGet = db.get.bind(db, {
            where: { userId },
            options: {
                limit: (size + 1),
                offset: ((page - 1) * size)
            }
        })
        const dbRes = await backoffRetries(boundGet, BACKOFF_RETRIES.COUNT, BACKOFF_RETRIES.INITIAL_DELAY)
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