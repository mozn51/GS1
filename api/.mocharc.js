module.exports = {
  require: ["ts-node/register"],
  extension: ["ts"],
  spec: "api/tests/**/*.test.ts",
  timeout: 5000,
  recursive: true
};
