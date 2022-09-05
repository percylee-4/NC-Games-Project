const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then((category) => {
    console.log(category.rows)
    return category.rows;
  });
};
