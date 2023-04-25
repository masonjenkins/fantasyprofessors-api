const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const articlesController = require('../controllers/articlesController');
const authorizationCheck = require('../middleware/authorizationCheck');
const fileUpload = require('../middleware/fileUpload')

router.get('/', articlesController.getArticles);

router.get('/search/:aid', articlesController.getArticleById);

router.use(authorizationCheck);

router.post('/create', fileUpload.single('image'),
    [check('title').not().isEmpty(),
    check('author').not().isEmpty(),
    check('date').not().isEmpty(),
    check('teaser').not().isEmpty(),
    check('body').not().isEmpty(),
    check('tags').not().isEmpty()
    ], articlesController.createArticle);

router.patch('/:aid', articlesController.editArticle);

router.delete('/:aid', articlesController.deleteArticle);

module.exports = router;