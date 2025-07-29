## URL Shortener Backend

### Tech Stack
- Node.js
- Express.js
- TypeScript
- SQLite
- ESLint

### How to Run Locally
1. **Clone the repository:**
   ```sh
   git clone https://github.com/foolhardy21/backend_url_shortener.git
   cd backend_url_shortener
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following:
     ```env
     PORT=""
     ```
4. **Run database migrations (if any):**
   - The database will be created automatically on first run.
5. **Start the server:**
   ```sh
   npm run dev
   ```
6. **API Endpoints:**
   - `POST /shorten` — Create a short URL
   - `GET /redirect?code=...` — Redirect to the original URL

---

### How to Run Test Cases Locally
1. **Make sure dependencies are installed:**
   ```sh
   npm install
   ```
2. **Run the test suite:**
   ```sh
   npm test
   ```
3. **View test results in the terminal.**

Test files are located in the `src/tests/` directory and use Jest with Supertest for integration testing.

---
