import { Router } from "express"
import multer from "multer"
import urlController from "../controllers/urlController"
import validators from "../middlewares/validators"
import { Logger } from "../middlewares/logger"

const router = Router()

const fileUpload = multer({ dest: "uploads/" })

router.post("/shorten", Logger, validators.validateShortenPayload, urlController.createShortUrl)
router.patch("/redirect", Logger, validators.validateRedirectQuery, urlController.updateUrlMetaData, urlController.getOriginalUrl)
router.delete("/", Logger, validators.validateDeleteParams, urlController.deleteByOriginalUrl)
router.post("/bulk-shorten", Logger, fileUpload.single("urlsCsv"), validators.validateBulkShortenPayload, urlController.createBulkShortUrls)
router.patch("/update", Logger, validators.validateUpdateQuery, urlController.updateUrlExpiry)
router.get("/user/:userId", Logger, validators.validateGetUserUrls, urlController.getUserUrls)

export default router