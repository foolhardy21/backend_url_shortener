import { Router } from "express"
import multer from "multer"
import urlController from "../controllers/urlController"
import validators from "../middlewares/validators"
const router = Router()

const fileUpload = multer({ dest: "uploads/" })

router.post("/shorten", validators.validateShortenPayload, urlController.createShortUrl)
router.patch("/redirect", validators.validateRedirectQuery, urlController.updateUrlMetaData, urlController.getOriginalUrl)
router.delete("/", validators.validateDeleteParams, urlController.deleteByOriginalUrl)
router.post("/bulk-shorten", fileUpload.single("urlsCsv"), validators.validateBulkShortenPayload, urlController.createBulkShortUrls)
router.patch("/update", validators.validateUpdateQuery, urlController.updateUrlExpiry)
router.get("/user/:userId", validators.validateGetUserUrls, urlController.getUserUrls)

export default router