const Tag = require("../models/tag")

const getTags = async (req, res)=>{
    try {
        const tags = await Tag.find()
        res.send(tags)
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    getTags
}
