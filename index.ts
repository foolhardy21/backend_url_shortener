import dotenv from "dotenv"
import express from "express"
import urlRoutes from "./src/routes/urlRoutes"
import { logger, requestTimer } from "./src/middlewares/common"

dotenv.config()

const app = express()

app.use(express.json())
app.use(requestTimer)
app.use(logger)
app.use("/api/url", urlRoutes)

let server: ReturnType<typeof app.listen> | undefined
if (process.env.NODE_ENV !== "test") {
    server = app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}

export { server }
export default app