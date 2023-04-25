const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const usersController = require('../controllers/usersController');

router.post('/login',
    [check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 8 })
    ],
    usersController.login);

router.post('/signup',
    [check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 8 })
],
 usersController.signup);

module.exports = router;