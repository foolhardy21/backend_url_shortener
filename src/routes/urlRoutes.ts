import { Router } from "express"
import multer from "multer"
import urlController from "../controllers/urlController"
import validators from "../middlewares/validators"
const router = Router()

const fileUpload = multer({ dest: "uploads/" })

router.post("/shorten", validators.validateShortenPayload, urlController.createShortUrl)
router.get("/redirect", validators.validateRedirectQuery, urlController.updateUrlMetaData, urlController.getOriginalUrl)
router.delete("/", validators.validateDeleteParams, urlController.deleteByOriginalUrl)
router.post("/bulk-shorten", fileUpload.single("urlsCsv"), validators.validateBulkShortenPayload, urlController.createBulkShortUrls)
router.patch("/update", validators.validateRedirectQuery, urlController.updateUrlExpiry)

export default router