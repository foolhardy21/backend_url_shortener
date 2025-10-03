import db from "../db/database"
import { User } from "../helpers/types"
import { BACKOFF_RETRIES, backoffRetries } from "../helpers/utils"

const getUserByApiKey = async (apiKey: string): Promise<User[]> => {
    try {
        const boundGet = db.getUsers.bind(db, {
            where: { apiKey },
            options: {},
        })
        const dbRes = await backoffRetries(boundGet, BACKOFF_RETRIES.COUNT, BACKOFF_RETRIES.INITIAL_DELAY)
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const getUserById = async ({ userId }: { userId: number }): Promise<User[]> => {
    try {
        const boundGet = db.getUsers.bind(db, {
            where: { id: userId },
            options: {},
        })
        const dbRes = await backoffRetries(boundGet, BACKOFF_RETRIES.COUNT, BACKOFF_RETRIES.INITIAL_DELAY)
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

export default {
    getUserByApiKey,
    getUserById,
}