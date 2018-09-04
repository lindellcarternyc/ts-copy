module.exports = {
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)spec)\\.ts$",
  testPathIgnorePatterns: ["/__tests__/(test-source|test-dest)/"],
  moduleFileExtensions: ["ts", "js"]
}