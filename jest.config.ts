module.exports = {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "testTimeout": 20000,
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "coverageProvider": "v8",
    "coverageThreshold": {
        "global": {
            "branches": 60,
            "functions": 80,
            "lines": 70,
            "statements": 70
      }
    }
}