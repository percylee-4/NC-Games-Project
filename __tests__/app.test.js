const { app } = require("../app");
const request = require("supertest");
const  db  = require("../db/connection");

const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
    return db.end()
})

describe("/api", () => {
  describe("/api/categories", () => {
    test("200: returns an array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
          expect(response.body.length > 0).toBe(true);
          response.body.forEach((category) => {
            expect(category.hasOwnProperty("slug")).toBe(true);
            expect(category.hasOwnProperty("description")).toBe(true);
          });
        });
    });
    test("404: returns an error message when passed an invalid url path", () => {
      return request(app)
      .get("/api/categos")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({"message": "404: invalid end point provided"})
      })
    });
  });
});
