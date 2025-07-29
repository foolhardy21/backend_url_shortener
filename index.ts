import dotenv from "dotenv"
import express from "express"
import urlRoutes from "./src/routes/urlRoutes"

dotenv.config()

const app = express()

app.use(express.json())

app.use("/api/url", urlRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

export default app