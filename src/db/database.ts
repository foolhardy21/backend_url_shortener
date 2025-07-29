import sqlite3 from "sqlite3"

sqlite3.verbose()

const db = new sqlite3.Database("./url_shortener_db.sqlite", (err) => {
    if (err) {
        console.error("Error while creating database", err)
    } else {
        console.log("Database created successfully")
    }
})

db.run(`
    CREATE TABLE IF NOT EXISTS url_map (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original_url TEXT NOT NULL,
        short_url TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`)

export default db