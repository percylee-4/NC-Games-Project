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
            const review = response.body.review;
            expect(review.review_id).toBe(1);
            expect(review.title).toBe("Agricola");
            expect(review.category).toBe("euro game");
            expect(review.designer).toBe("Uwe Rosenberg");
            expect(review.owner).toBe("mallionaire");
            expect(review.review_body).toBe("Farmyard fun!");
            expect(review.review_img_url).toBe(
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
            );
            expect(review.created_at).toBe("2021-01-18T10:00:20.514Z");
            expect(review.votes).toBe(1);
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
      test("400: responds with a 400 status code and an error message when passed an invalid user id datatype", () => {
        return request(app)
          .get("/api/reviews/false")
          .expect(400)
          .then((response) => {
            expect(response.body.message).toBe(
              "Invalid id provided, a review id must be a number."
            );
          });
      });
      test("201:, responds with the updated review containing an incremented vote count", () => {
        const incrementer = { inc_votes: 20 };
        return request(app)
          .patch("/api/reviews/1")
          .send(incrementer)
          .expect(201)
          .then((response) => {
            const review = response.body.review;
            expect(review.hasOwnProperty("review_id")).toBe(true);
            expect(review.hasOwnProperty("title")).toBe(true);
            expect(review.hasOwnProperty("review_body")).toBe(true);
            expect(review.hasOwnProperty("designer")).toBe(true);
            expect(review.hasOwnProperty("review_img_url")).toBe(true);
            expect(review.hasOwnProperty("votes")).toBe(true);
            expect(review.hasOwnProperty("category")).toBe(true);
            expect(review.hasOwnProperty("owner")).toBe(true);
            expect(review.hasOwnProperty("created_at")).toBe(true);
            expect(review.votes).toBe(21);
          });
      });
      test("201:, responds with the updated review containing a decremented vote count", () => {
        const decrementer = { inc_votes: -20 };
        return request(app)
          .patch("/api/reviews/1")
          .send(decrementer)
          .expect(201)
          .then((response) => {
            const review = response.body.review;
            expect(review.hasOwnProperty("review_id")).toBe(true);
            expect(review.hasOwnProperty("title")).toBe(true);
            expect(review.hasOwnProperty("review_body")).toBe(true);
            expect(review.hasOwnProperty("designer")).toBe(true);
            expect(review.hasOwnProperty("review_img_url")).toBe(true);
            expect(review.hasOwnProperty("votes")).toBe(true);
            expect(review.hasOwnProperty("category")).toBe(true);
            expect(review.hasOwnProperty("owner")).toBe(true);
            expect(review.hasOwnProperty("created_at")).toBe(true);
            expect(review.votes).toBe(-19);
          });
      });
      test("400: responds with an error message when passed incorrect datatypes", () => {
        const incorrectData = { inc_votes: false };
        return request(app)
          .patch("/api/reviews/999")
          .send(incorrectData)
          .expect(400)
          .then((response) => {
            expect(response.body.message).toBe(
              "Invalid id or vote count provided, these must be a number."
            );
          });
      });
    });
  });
});
describe("/api/users", () => {
  test("200: returns an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        expect(users.length === 4).toBe(true);
        users.forEach((user) => {
          expect(user.hasOwnProperty("username")).toBe(true);
          expect(user.hasOwnProperty("name")).toBe(true);
          expect(user.hasOwnProperty("avatar_url")).toBe(true);
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
