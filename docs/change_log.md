# Version 3.1.0

Changelog
**Released** Sept 5, 2025

### v3.1.0
**Released** Aug 30, 2025

Added middleware features and validators.
 - Blacklist middleware
 - Enterprise role validator
 - Common API-key validator
 - Logger middleware and table

The following endpoints are affected:
 - POST `/bulk-shorten`
 - POST `/shorten`
 - DELETE `/`


### v3.0.0
**Released** Aug 19, 2025

New user-related features.
 - Get user's URLs endpoint
 - Optional URL password protection
 - User tier and edit URL expiry date

The following endpoints are affected:
 - GET `/user/:userId`
 - POST `/shorten`
 - PATCH `/update`


### v2.2.0
**Released** Aug 18, 2025

Added bulk shorten URLs feature.

The following endpoints are affected:
 - POST `/bulk-shorten`


### v2.1.0
**Released** Aug 17, 2025

Feature improvements for URL shortening.
 - Unique customCode in shortening payload
 - Added URL expiry date

The following endpoints are affected:
 - POST `/shorten`


### v2.0.0
**Released** Aug 16, 2025

Enhancements to URL model and query features.
 - Mandatory API key support for shortening and deletion.
 - Added query for most shortened URLs
 - Allowed duplicate original URLs
 - Added support for soft deletion

The following endpoints are affected:
 - PATCH `/redirect`
 - POST `/shorten`
 - DELETE `/`


### v1.1.1
**Released** Aug 15, 2025

Enhancements to URL model and query features.
 - Added visit count and accessed at columns for URLs

The following endpoints are affected:
 - PATCH `/redirect`


### v1.1.0
**Released** Aug 5, 2025

Added validator middlewares and delete route.
 - Validator middlewares
 - Delete route to remove shortened URLs

The following endpoints are affected:
 - GET `/redirect`
 - POST `/shorten`
 - DELETE `/`


### v1.0.0
**Released** July 29, 2025

Initial release with basic URL shortening functionality.
 - Added GET redirect route
 - Added POST shorten route
 - Project initial setup

The following endpoints are affected:
 - GET `/redirect`
 - POST `/shorten`
