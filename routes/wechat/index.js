'use strict';

let express = require('express')
let router = express.Router()
let index = require('../../controllers/wechat/index')

router.use(function(req,res,next){
    res.locals.path = 'wechat';
    next();
});

router.route('/').get(index.auth);
router.route('/getAccessToken').get(index.getAccessToken);
router.route('/createMenu').get(index.createMenu);

module.exports = function(app) {
    app.use('/content', router);
};