const { selectCategories } = require("../models/categories.model")


exports.getCategories = (req,res,next) => {
    selectCategories()
    .then((categories) => {
        // console.log(category)
        res.status(200).send(categories)
    })
    
}