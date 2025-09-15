import dotenv from "dotenv"
import express from "express"
import urlRoutes from "./src/routes/urlRoutes"
import { logger, rateLimiter, requestTimer } from "./src/middlewares/common"

dotenv.config()

const app = express()

app.use(express.json())
app.use(rateLimiter)
app.use(requestTimer)
app.use(logger)
app.use("/api/url", urlRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})

export default app