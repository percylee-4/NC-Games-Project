const { app } = require("../app");
const request = require("supertest");
const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("/api/", () => {
  describe("/api/categories", () => {
    test("200: returns an array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
          const categories = response.body.categories;
          expect(categories.length === 4).toBe(true);
          categories.forEach((category) => {
            expect(category.hasOwnProperty("slug")).toBe(true);
            expect(category.hasOwnProperty("description")).toBe(true);
          });
        });
    });
  });
  describe("/api/reviews", () => {
    describe("/api/reviews/:review_id", () => {
      test("200: responds with a review object matching the passed id", () => {
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then((response) => {
            const reviews = response.body.reviews;
            expect(reviews.length === 1).toBe(true);
            reviews.forEach((review) => {
              expect(review.hasOwnProperty("review_id")).toBe(true);
              expect(review.hasOwnProperty("title")).toBe(true);
              expect(review.hasOwnProperty("review_body")).toBe(true);
              expect(review.hasOwnProperty("designer")).toBe(true);
              expect(review.hasOwnProperty("review_img_url")).toBe(true);
              expect(review.hasOwnProperty("votes")).toBe(true);
              expect(review.hasOwnProperty("category")).toBe(true);
              expect(review.hasOwnProperty("owner")).toBe(true);
              expect(review.hasOwnProperty("created_at")).toBe(true);
            });
          });
      });
      test("404: responds with a 404 status code and an error message when passed an id that does not exist", () => {
        return request(app)
          .get("/api/reviews/999")
          .expect(404)
          .then((response) => {
            expect(response.body.message).toBe(
              "Sorry, there is no review with that id. Please try again."
            );
          });
      });
    });
  });
});
describe("404: mispelt url path", () => {
  test("404: returns an error message when passed an invalid url path", () => {
    return request(app)
      .get("/api/categos")
      .expect(404)
      .then((response) => {
        expect(response.body).toEqual({
          message: "404: invalid end point provided",
        });
      });
  });
});
