import { Router } from "express"
import multer from "multer"
import urlController from "../controllers/urlController"
import validators from "../middlewares/validators"
import { apiKeyValidator, enterpriseRoleValidator, logger } from "../middlewares/common"

const router = Router()

const fileUpload = multer({ dest: "uploads/" })

router.post("/shorten", logger, apiKeyValidator, validators.validateShortenPayload, urlController.createShortUrl)
router.patch("/redirect", logger, validators.validateRedirectQuery, urlController.updateUrlMetaData, urlController.getOriginalUrl)
router.delete("/", logger, apiKeyValidator, validators.validateDeleteParams, urlController.deleteByOriginalUrl)
router.post("/bulk-shorten", logger, apiKeyValidator, enterpriseRoleValidator, fileUpload.single("urlsCsv"), validators.validateBulkShortenPayload, urlController.createBulkShortUrls)
router.patch("/update", logger, validators.validateUpdateQuery, urlController.updateUrlExpiry)
router.get("/user/:userId", logger, validators.validateGetUserUrls, urlController.getUserUrls)

export default router