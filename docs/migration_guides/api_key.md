## Upgrade to API Version v2.0.0

On Aug 16, 2025, we will add user authentication and tier system for some of the APIs.

### What has changed?
We are introducing authentication and a tier system for all the users. There will be two tiers - **hobby** and **enterprise**. By default, user will be assigned to the hobby tier and an **API key** will be assigned to him/her. 

### How does it affect the app ?
This API key will required as a **mandatory** header for the following features:
1. shortening, 
2. deletion, and 
3. bulk shortening of URLs.

Furthermore, the following feature will be available only to the users with `enterprise` tier:
1. bulk shortening of URLs.

### Migration Steps:
1. Contact your client support and create an API key for yourself. This will be used to authenticate your identity.
2. Add this API key in the request header of the aforementioned APIs under `x-api-key`.
3. If this header is missing, you should see a 401 error response.
4. To use the bulk shortening feature, contact your support and upgrade to enterprise tier and continue using the same API key.

