const mongoose = require('mongoose')

const schema = mongoose.Schema 

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: String, required: true },
    teaser: { type: String, required: true },
    body: { type: String, requierd: true },
    tags: { type: Array, required: true } 
})

module.exports = mongoose.model('Article', articleSchema)