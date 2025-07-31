import db from "../db/database"

const getTotalUrlsCount = (callback: (err: Error | null, queryObj: { count: number }) => void): void => {
    db.get("SELECT COUNT(*) AS count FROM url_map", [], callback)
}

const getLastUrlId = (callback: (err: Error | null, queryObj: { id: number }) => void) => {
    db.get("SELECT id FROM url_map ORDER BY id DESC LIMIT 1", [], callback)
}

const create = (urlObj: { originalUrl: string, shortUrl: string }, callback: (err: Error | null) => void) => {
    db.run("INSERT INTO url_map (original_url, short_url) VALUES (?, ?)", [urlObj.originalUrl, urlObj.shortUrl], callback)
}

const getByShortUrl = (shortUrl: string, callback: (err: Error | null, queryRes: { id: string, original_url: string, short_url: string, created_at: string }) => void) => {
    db.get("SELECT * FROM url_map WHERE short_url = ?", [shortUrl], callback)
}

const deleteByOriginalUrl = (originalUrl: string, callback: (err: Error | null) => void) => {
    db.run("DELETE FROM url_map WHERE original_url = ?", [originalUrl], callback)
}

export default {
    getTotalUrlsCount,
    create,
    getByShortUrl,
    deleteByOriginalUrl,
    getLastUrlId,
}