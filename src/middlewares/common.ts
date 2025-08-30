import { NextFunction, Response, Request } from "express"
import logModel from "../models/logModel"
import userModel from "../models/userModel"
import { USER_TYPES } from "../helpers/utils"

export async function logger(req: Request, _: Response, next: NextFunction) {
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

export async function apiKeyValidator(req: Request, res: Response, next: NextFunction) {
    try {
        const requestApiKey = req.headers["x-api-key"]
        if (!requestApiKey) {
            return res.status(401).json({ success: false, message: "Missing API key." })
        }
        const userRes = await userModel.getUserByApiKey(requestApiKey as string)
        if (userRes.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid API key." })
        }
        (req as any).userTier = userRes[0].tier;
        (req as any).userId = userRes[0].id
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({ success: false, message: "Could not validate the API key." })
    }
}

export async function enterpriseRoleValidator(req: Request, res: Response, next: NextFunction) {
    try {
        const requestApiKey = req.headers["x-api-key"]
        let userTier = (req as any).userTier
        if (!userTier) {
            const [user] = await userModel.getUserByApiKey(requestApiKey as string)
            userTier = user.tier
        }
        if (userTier != USER_TYPES.ENTERPRISE) return res.status(401).json({ success: false, message: "Access denied. This feature is available to Enterprise tier users only." })
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({ success: false, message: "Could not validate the API key." })
    }
}