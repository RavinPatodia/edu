'use strict';

let mongoose = require('mongoose')
let Content = mongoose.model('Content')
let Message = mongoose.model('Message')
let Category = mongoose.model('Category')
let _ = require('lodash')
let File = mongoose.model('File')
let config = require('../../config')
let core = require('../../libs/core')
let contentService = require('../../services/content')
exports.index = async function(req, res) {
    let condition = {};
    let key = req.query.key;
    if(key) {
        let _key = key.replace(/([\(\)\[])/g, '\\$1');//正则bugfix
        let k = '[^\s]*' + _key + '[^\s]*';
        let reg = new RegExp(k, 'gi');
        condition.title = reg;
    }
    
    try {
        let total = await contentService.count(condition)
        let pageInfo = core.createPage(req.query.page, total);
        let contents = await contentService.find(condition, null, {
            populate: 'author gallery',
            skip: pageInfo.start,
            limit: pageInfo.pageSize,
            sort: {
                created: -1
            }
        })

        let newest = await contentService.find(condition, null, {
            limit: 10,
            sort: {
                created: -1
            }
        })

        let hotest = await contentService.find(condition, null, {
            limit: 10,
            sort: {
                visits: -1
            }
        })
        res.render('app/index.hbs', {
            layout: 'app_layout',
            contents: contents,
            pageInfo: pageInfo,
            key: key,
            total: total,
            newest: newest,
            hotest: hotest
        });

    } catch (e) {
        console.log(e)
        res.render('app/info.hbs', { layout:'app_layout',
            message: '系统开小差了，请稍等'
        });
    }
};

exports.contact = function(req, res) {
    if(req.method === 'GET') {
        res.render('app/contact.hbs', {
            layout: 'app_layout',
            Path: 'contact'
        });
    } else if (req.method === 'POST') {
        let obj = _.pick(req.body, 'name', 'email', 'content');
        obj.ip = core.getIp(req);
        let contact = new Message(obj);
        contact.save(function(err, result) {
            console.log(err, result);
            if (err) {
                return res.render('app/info.hbs', { layout:'app_layout',
                    message: err.message
                });
            } else {
                res.render('app/info.hbs', { layout:'app_layout',
                    message: '提交成功!'
                });
            }
        })
        
    }
    
}

