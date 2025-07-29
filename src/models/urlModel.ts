import db from "../db/database"

const getTotalUrlsCount = (callback: (err: Error | null, queryObj: { count: number }) => void): void => {
    db.get("SELECT COUNT(*) AS count FROM url_map", [], callback)
}

const create = (urlObj: { originalUrl: string, shortUrl: string }, callback: (err: Error) => void) => {
    db.run("INSERT INTO url_map (original_url, short_url) VALUES (?, ?)", [urlObj.originalUrl, urlObj.shortUrl], callback)
}

export default {
    getTotalUrlsCount,
    create,
}