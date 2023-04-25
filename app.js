const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const articlesRoutes = require('./routes/articlesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const HttpError = require('./models/httpError')
const app = express();
const fs = require('fs')
const path = require('path')
const cors = require('cors')

app.use(bodyParser.json());

app.use(cors())

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use('/api/articles', articlesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    return new HttpError('Route not found.', 404)
});

app.use((error, req, res, next) => {
    if(req.file) {
        fs.unlink(req.file.path, (e) => {
            console.log(e)
        })
    }
    if(res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({
        status: error.code || 500, 
        message: error.message || "An unknown error occurred."
    })
})

mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.shqmdcm.mongodb.net/${process.env.MONGO_NAME}?retryWrites=true&w=majority`)
    .then(() => {app.listen(process.env.PORT || 5000)})
    .catch(e => {console.log(e)})
