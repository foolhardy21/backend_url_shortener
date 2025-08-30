import db from "../db/database"

const createLog = async ({ url, method, timestamp, userAgent, ipAddress }: { method: string, url: string, timestamp: Date, userAgent?: string, ipAddress?: string }): Promise<void | Error> => {
    try {
        await db.createLog({
            url,
            method,
            timestamp,
            userAgent,
            ipAddress,
        })
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

export default {
    createLog,
}