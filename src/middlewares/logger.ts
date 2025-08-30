import { NextFunction, Response, Request } from "express"
import logModel from "../models/logModel"

export const Logger = async (req: Request, _: Response, next: NextFunction) => {
    try {
        const timestamp = new Date()
        const url = req.originalUrl
        const method = req.method
        const userAgent = req.headers["user-agent"]
        const ipAddress = req.ip

        console.log(method + " " + url, " at ", timestamp, " from ", userAgent, " | ", ipAddress)

        await logModel.createLog({
            url,
            method,
            timestamp,
            userAgent,
            ipAddress,
        })
    } catch (err) {
        console.log(err)
    } finally {
        next()
    }
}
