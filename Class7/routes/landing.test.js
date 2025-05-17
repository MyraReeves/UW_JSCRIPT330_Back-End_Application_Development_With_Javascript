const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

describe("/landing", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  describe("GET /", () => {
    it("should return landing page", async () => {
      const res = await request(server).get("/landing/");
      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('Hello, World');
    });
  });
});