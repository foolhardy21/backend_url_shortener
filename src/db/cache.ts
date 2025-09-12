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

    async hSet(key: string | Buffer, value: any) {
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

}

const cache = new CacheDB()
cache.initialize()
export default cache