import fs from "fs"
import path from "path"
import { NextFunction, Response, Request } from "express"
import logModel from "../models/logModel"
import userModel from "../models/userModel"
import { USER_TYPES } from "../helpers/utils"
import cache from "../db/cache"

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
        (req as any).user = userRes[0]
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({ success: false, message: "Could not validate the API key." })
    }
}

export async function enterpriseRoleValidator(req: Request, res: Response, next: NextFunction) {
    try {
        let userTier = (req as any).user.tier
        if (userTier != USER_TYPES.ENTERPRISE) return res.status(401).json({ success: false, message: "Access denied. This feature is available to Enterprise tier users only." })
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({ success: false, message: "Could not validate the API key." })
    }
}

export async function blacklistedUsersValidator(req: Request, res: Response, next: NextFunction) {
    try {
        const requestApiKey = req.headers["x-api-key"]
        const blacklistedKeysFilePath = path.join(__dirname, "../config/blacklisted-users.txt")
        fs.readFile(blacklistedKeysFilePath, "utf-8", (err, data) => {
            if (err) { console.log(err) } else {
                const apiKeysArr = data.split(",")
                if (apiKeysArr.includes(requestApiKey as string)) {
                    return res.status(403).json({ success: false, message: "You are not allowed to perform this action." })
                }
            }
        })
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err })
    }
}

export function requestTimer(_: Request, res: Response, next: NextFunction) {
    const startTime = Date.now()
    const originalSend = res.send
    res.send = function (...args) {
        const timeElapsed = Date.now() - startTime
        res.setHeader("X-Elapsed-Time", (timeElapsed + "ms"))
        return originalSend.apply(res, args)
    }

    next()
}

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
    const ip = String(req.ip)
    try {
        if (ip) {
            const ipCount = await cache.increment(ip)
            if (ipCount == 1) {
                await cache.expire(ip, 60)
            } else if (ipCount >= 100) {
                return res.status(429).json({ status: false, message: "Too many requests. Please wait for atleast 60 seconds." })
            }
        }
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err?.toString() })
    }
}