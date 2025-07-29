import { Router } from "express"
import urlController from "../controllers/urlController"

const router = Router()

router.post("/shorten", urlController.createShortUrl)

export default router