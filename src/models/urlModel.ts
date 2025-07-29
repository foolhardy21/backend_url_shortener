import db from "../db/database"

const getTotalUrlsCount = (callback: (err: Error | null, queryObj: { count: number }) => void): void => {
    db.get("SELECT COUNT(*) AS count FROM url_map", [], callback)
}

const create = (urlObj: { originalUrl: string, shortUrl: string }, callback: (err: Error) => void) => {
    db.run("INSERT INTO url_map (original_url, short_url) VALUES (?, ?)", [urlObj.originalUrl, urlObj.shortUrl], callback)
}

const getByShortUrl = (shortUrl: string, callback: (err: Error, queryRes: { id: string, original_url: string, short_url: string, created_at: string }) => void) => {
    db.get("SELECT * FROM url_map WHERE short_url = ?", [shortUrl], callback)
}

export default {
    getTotalUrlsCount,
    create,
    getByShortUrl
}