const request = require("supertest");

const server = require("../server");
const testUtils = require("../test-utils");

const User = require("../models/user");

describe("/auth", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  const user0 = {
    email: "user0@mail.com",
    password: "123password",
  };
  const user1 = {
    email: "user1@mail.com",
    password: "456password",
  };

  describe("before signup", () => {
    describe("POST /", () => {
      it("should return 401", async () => {
        const res = await request(server).post("/auth/login").send(user0);
        expect(res.statusCode).toEqual(401);
      });
    });
  });

  describe("signup ", () => {
    describe("POST /signup", () => {
      it("should return 400 without a password", async () => {
        const res = await request(server).post("/auth/signup").send({
          email: user0.email,
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 400 with empty password", async () => {
        const res = await request(server).post("/auth/signup").send({
          email: user1.email,
          password: "",
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 200 with a password", async () => {
        const res = await request(server).post("/auth/signup").send(user1);
        expect(res.statusCode).toEqual(200);
      });

      it("should return 409 Conflict with a repeat signup", async () => {
        let res = await request(server).post("/auth/signup").send(user0);
        expect(res.statusCode).toEqual(200);
        res = await request(server).post("/auth/signup").send(user0);
        expect(res.statusCode).toEqual(409);
      });

      it("should not store raw password", async () => {
        await request(server).post("/auth/signup").send(user0);
        const users = await User.find().lean();
        users.forEach((user) => {
          expect(Object.values(user)).not.toContain(user0.password);
        });
      });
    });
  });

  describe.each([user0, user1])("User %# after signup", (user) => {
    beforeEach(async () => {
      await request(server).post("/auth/signup").send(user0);
      await request(server).post("/auth/signup").send(user1);
    });

    describe("POST /", () => {
      it("should return 400 when password isn't provided", async () => {
        const res = await request(server).post("/auth/login").send({
          email: user.email,
        });
        expect(res.statusCode).toEqual(400);
      });

      it("should return 401 when password doesn't match", async () => {
        const res = await request(server).post("/auth/login").send({
          email: user.email,
          password: "123",
        });
        expect(res.statusCode).toEqual(401);
      });

      it("should return 200 and a token when password matches", async () => {
        const res = await request(server).post("/auth/login").send(user);
        expect(res.statusCode).toEqual(200);

        // Some basic tests for a JWT
        const token = res.body.token;
        expect(typeof token).toEqual("string");
        expect(token.split('.')).toHaveLength(3);

        const header = JSON.parse(atob(token.split('.')[0]));
        expect(header.typ.toUpperCase()).toEqual('JWT');
      });
    });
  });
});
