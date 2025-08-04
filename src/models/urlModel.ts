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

const getLastUrlId = async (): Promise<number> => {
    try {
        const dbRes = await db.get({
            where: {},
            options: {
                order: [["id", "DESC"]],
                limit: 1,
            }
        })
        return dbRes[0].id as number
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const create = async (urlObj: { originalUrl: string, shortUrl: string }): Promise<Url> => {
    try {
        const dbRes = await db.create({ originalUrl: urlObj.originalUrl, shortUrl: urlObj.shortUrl })
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
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

const deleteByOriginalUrl = async ({ originalUrl }: { originalUrl: string }): Promise<void> => {
    try {
        await db.delete({
            where: {
                originalUrl
            }
        })
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
    getLastUrlId,
}