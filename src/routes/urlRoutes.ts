import { Router } from "express"
import urlController from "../controllers/urlController"
import validators from "../middlewares/validators"

const router = Router()

router.post("/shorten", validators.validateShortenPayload, urlController.createShortUrl)
router.get("/redirect", validators.validateRedirectQuery, urlController.updateUrlMetaData, urlController.getOriginalUrl)
router.delete("/", validators.validateDeleteParams, urlController.deleteByOriginalUrl)

export default router