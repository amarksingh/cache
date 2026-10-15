const tsJestPath = "/Users/amarkumarsingh/.nvm/versions/node/v24.12.0/lib/node_modules/ts-jest";

module.exports = {
    "testEnvironment": "node",
    "testMatch": [
        "**/test/**/*.test.ts",
        "**/test/**/*.test.js"
    ],
    "transform": {
        "^.+\\.ts$": [
            tsJestPath,
            {
                "tsconfig": "<rootDir>/tsconfig.json"
            }
        ]
    },
    "moduleNameMapper": {
        "^@ostro/support/(.*)$": "<rootDir>/../support/$1",
        "^@ostro/support$": "<rootDir>/../support",
        "^@ostro/contracts/(.*)$": "<rootDir>/../contracts/$1",
        "^@ostro/contracts$": "<rootDir>/../contracts",
        "^@ostro/cache/(.*)$": "<rootDir>/$1",
        "^@ostro/cache$": "<rootDir>/cacheManager"
    },
    "collectCoverage": true,
    "coverageDirectory": "coverage",
    "coverageReporters": [
        "text",
        "lcov",
        "clover"
    ]
};
