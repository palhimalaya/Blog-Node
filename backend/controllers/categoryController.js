const Category = require("../models/category")

const createCategory = async (req, res) =>{
    try {
        const category = new Category(req.body)
        await category.save()
        res.status(201).send(category)
    } catch (error) {
        res.status(400).send(error)
    }
}

const getCategories = async (req, res) =>{
    try {
        const categories = await Category.find()
        res.send(categories)
    } catch (error) {
        res.status(500).send(error)
    }
} 

module.exports = {
    createCategory,
    getCategories
}