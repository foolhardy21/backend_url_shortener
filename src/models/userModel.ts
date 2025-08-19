import db from "../db/database"
import { User } from "../helpers/types"

const getUserByApiKey = async (apiKey: string): Promise<User[]> => {
    try {
        const dbRes = await db.getUsers({
            where: { apiKey },
            options: {},
        })
        return dbRes
    } catch (err) {
        console.log(err)
        throw err as Error
    }
}

const getUserById = async ({ userId }: { userId: number }): Promise<User[]> => {
    try {
        const dbRes = await db.getUsers({
            where: { id: userId },
            options: {},
        })
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