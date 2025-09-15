import { Router } from "express"
import multer from "multer"
import urlController from "../controllers/urlController"
import validators from "../middlewares/validators"
import { apiKeyValidator, blacklistedUsersValidator, enterpriseRoleValidator } from "../middlewares/common"

const router = Router()

const fileUpload = multer({ dest: "uploads/" })

router.post("/shorten", apiKeyValidator, blacklistedUsersValidator, validators.validateShortenPayload, urlController.createShortUrl)
router.patch("/redirect", validators.validateRedirectQuery, urlController.updateUrlMetaData, urlController.getOriginalUrl)
router.delete("/", apiKeyValidator, blacklistedUsersValidator, validators.validateDeleteParams, urlController.deleteByOriginalUrl)
router.post("/bulk-shorten", apiKeyValidator, blacklistedUsersValidator, enterpriseRoleValidator, fileUpload.single("urlsCsv"), validators.validateBulkShortenPayload, urlController.createBulkShortUrls)
router.patch("/update", validators.validateUpdateQuery, urlController.updateUrlExpiry)
router.get("/user/:userId", validators.validateGetUserUrls, urlController.getUserUrls)

export default router