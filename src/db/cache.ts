import { createClient, RedisClientType } from "redis"

class CacheDB {
    #client: RedisClientType
    constructor() {
        this.#client = createClient({
            url: "redis://localhost:6379"
        })
        this.#client.on("error", (err) => {
            console.log("cache server error", err)
        })
    }

    async initialize() {
        await this.#client.connect()
        console.log("connected to cache server")
    }

    async set(key: string | Buffer, value: string | Buffer | number) {
        try {
            await this.#client.set(key, value)
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async get(key: string | Buffer) {
        try {
            const value = await this.#client.get(key)
            return value || ""
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async hSet(key: string | Buffer, value: Record<string, string | number>) {
        try {
            await this.#client.hSet(key, value)
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async hGet(key: string | Buffer) {
        try {
            const value = await this.#client.hGetAll(key)
            return value
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async expire(key: string | Buffer, expiryTime: number = 60) {
        try {
            await this.#client.expire(key, expiryTime)
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async increment(key: string | Buffer) {
        try {
            const value = await this.#client.incr(key)
            return value
        } catch (err) {
            console.log(err)
            throw err
        }
    }

    async disconnect() {
        await this.#client.quit()
    }

    async flush() {
        await this.#client.flushAll()
    }

}

const cache = new CacheDB()
cache.initialize()
export default cache