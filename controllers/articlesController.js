const HttpError = require('../models/httpError')
const { validationResult } = require('express-validator')
const Article = require('../models/article');
const _ = require('lodash')


const getArticleById = async (req, res, next) => {
    const articleId = req.params.aid;
    let article
    try {
        article = await Article.findById(articleId)
    } catch (e) {
        return next(new HttpError("Error retrieving article.", 500))
    }

    if (!article) {
        return next(new HttpError('Article not found.', 404));
    }
    
    res.json({ articles: article});
}

const getArticles = async (req, res, next) => {
    let articles

    try {
        articles = await Article.find()
    } catch (e) {
        return next(new HttpError('Error retrieving articles.', 500))
    }

    res.json({ articles })
}

const createArticle = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid API Call arguments. Try again with correct params.', 400))
    }
    if(!req.file) {
        return next(new HttpError('Error saving image. Try again.', 500))
    }
    const { title, author, date, teaser, body, tags } = req.body
    let newArticle

    const newTags = tags.split(',')

    const createdArticle = new Article({
        title,
        author,
        date,
        image: req.file.location,
        teaser,
        body,
        tags: newTags
    })

    try {
        await createdArticle.save().then(item => {
            newArticle = item._id
        })
    } catch (e) {
        const err = new HttpError("Error creating article. Try again.", 500)
        return (next(err))
    }

    res.status(201).json({ id: newArticle })
}

const editArticle = async (req, res, next) => {
    const articleId = req.params.aid

    if(_.isEmpty(req.body)) {
        return next(new HttpError('No params were sent in the API call. Try again.', 400))
    }

    const title = req.body.title ? req.body.title : ""
    const author = req.body.author ? req.body.author : ""
    const date = req.body.date ? req.body.date : ""
    const image = req.body.image ? req.body.image : ""
    const teaser = req.body.teaser ? req.body.teaser : ""
    const body = req.body.body ? req.body.body : ""
    const tags = req.body.tags ? req.body.tags : ""

    let updatedArticle

    try {
        updatedArticle = await Article.findById(articleId)
    } catch (e) {
        return next(new HttpError('Error retrieving article.', 500))
    }

    if(title) {updatedArticle.title = title}
    if(author) {updatedArticle.author = author}
    if(date) {updatedArticle.date = date}
    if(image) {updatedArticle.image = image}
    if(teaser) {updatedArticle.teaser = teaser}
    if(body) {updatedArticle.body = body}
    if(tags) {updatedArticle.tags = tags}


    try {
        await updatedArticle.save()
    } catch(e) {
        return next(new HttpError('Error editing article.', 500))
    }


    res.json({ article: updatedArticle.toObject({ getters: true })})
}

const deleteArticle = async (req, res, next) => {
    const articleId = req.params.aid

    let article 

    try {
        article = Article.findById(articleId)
        article.remove()
    } catch (e) {
        return next(new HttpError("Error deleting article.", 500))
    }

    res.json({ message: "Article deleted." })
}

exports.getArticleById = getArticleById;
exports.getArticles = getArticles;
exports.createArticle = createArticle;
exports.editArticle = editArticle;
exports.deleteArticle = deleteArticle;