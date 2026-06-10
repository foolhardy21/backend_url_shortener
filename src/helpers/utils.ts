import fs from "fs"
import csv from "csv-parser"
import { BulkShortenUrlObj } from "./types"

export function generateShortCode(num: number): string {
    const chars: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let encoded: string = ""
    while (num > 0) {
        encoded = chars[num % chars.length] + encoded
        num = Math.floor(num / chars.length)
    }
    return encoded
}

export const parseBulkShortenUrlsFile = (file: Express.Multer.File): Promise<BulkShortenUrlObj[]> => {
    return new Promise((resolve, reject) => {
        const rows: BulkShortenUrlObj[] = []
        fs.createReadStream(file.path)
            .pipe(csv())
            .on("data", (data) => rows.push(data))
            .on("end", () => {
                for (const row of rows) {
                    for (const key in row) {
                        if (!row[key]) delete row[key]
                    }
                }
                resolve(rows)
            })
            .on("error", (err) => {
                reject(err)
            })
    })
}

export const USER_TYPES = {
    FREE: "free",
    HOBBY: "hobby",
    ENTERPRISE: "enterprise",
}

export const RATE_LIMIT = {
    SHORTEN: 10 * 60,
    REDIRECT: 50 * 60,
    FREE_PLAN: 5,
    DEFAULT: 100,
}

export const BACKOFF_RETRIES = {
    COUNT: 3,
    INITIAL_DELAY: 1000,
}

export async function backoffRetries<T>(
    fn: () => Promise<T>,
    retryCount: number = 5,
    initialDelay: number = 1000,
): Promise<T> {
    try {
        return await fn()
    } catch (err) {
        console.log("failed with ", err, retryCount)
        if (retryCount <= 1) throw err as Error
        await new Promise(resolve => setTimeout(resolve, initialDelay))
        return backoffRetries(fn, retryCount - 1, initialDelay * 2)
    }
}