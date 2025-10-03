import db from "../db/database"
import { BACKOFF_RETRIES, backoffRetries } from "../helpers/utils"

const createLog = async ({ url, method, timestamp, userAgent, ipAddress }: { method: string, url: string, timestamp: Date, userAgent?: string, ipAddress?: string }): Promise<void | Error> => {
    try {
        const boundCreate = db.createLog.bind(db, {
            url,
            method,
            timestamp,
            userAgent,
            ipAddress,
        })
        await backoffRetries(boundCreate, BACKOFF_RETRIES.COUNT, BACKOFF_RETRIES.INITIAL_DELAY)
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

export default {
    createLog,
}