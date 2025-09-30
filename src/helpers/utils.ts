import fs from "fs"
import csv from "csv-parser"

export function generateShortCode(num: number): string {
    const chars: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let encoded: string = ""
    while (num > 0) {
        encoded = chars[num % chars.length] + encoded
        num = Math.floor(num / chars.length)
    }
    return encoded
}

export const parseBulkShortenUrlsFile = (file: Express.Multer.File): Promise<any> => {
    return new Promise((resolve, reject) => {
        let rows: any = []
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