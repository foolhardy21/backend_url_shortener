import { Router } from "express"
import urlController from "../controllers/urlController"

const router = Router()

router.post("/shorten", urlController.createShortUrl)
router.get("/redirect", urlController.getOriginalUrl)

export default router