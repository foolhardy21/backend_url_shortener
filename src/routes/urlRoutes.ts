import { Router } from "express"
import multer from "multer"
import urlController from "../controllers/urlController"
import validators from "../middlewares/validators"
import { apiKeyValidator, blacklistedUsersValidator, enterpriseRoleValidator, logger, requestTimer } from "../middlewares/common"

const router = Router()

const fileUpload = multer({ dest: "uploads/" })

router.post("/shorten", requestTimer, logger, apiKeyValidator, blacklistedUsersValidator, validators.validateShortenPayload, urlController.createShortUrl)
router.patch("/redirect", requestTimer, logger, validators.validateRedirectQuery, urlController.updateUrlMetaData, urlController.getOriginalUrl)
router.delete("/", requestTimer, logger, apiKeyValidator, blacklistedUsersValidator, validators.validateDeleteParams, urlController.deleteByOriginalUrl)
router.post("/bulk-shorten", requestTimer, logger, apiKeyValidator, blacklistedUsersValidator, enterpriseRoleValidator, fileUpload.single("urlsCsv"), validators.validateBulkShortenPayload, urlController.createBulkShortUrls)
router.patch("/update", requestTimer, logger, validators.validateUpdateQuery, urlController.updateUrlExpiry)
router.get("/user/:userId", requestTimer, logger, validators.validateGetUserUrls, urlController.getUserUrls)

export default router