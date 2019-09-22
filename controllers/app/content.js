'use strict';

let mongoose = require('mongoose')
let Comment = mongoose.model('Comment')
let Content = mongoose.model('Content')
let Category = mongoose.model('Category')
let core = require('../../libs/core')
let strip = require('strip');

//列表
/*exports.list = function(req, res) {
    let condition = {};
    let category = req.query.category;
    if(category) {
        condition.category = category;
    }
    //查数据总数
    Content.count(condition, function(err, total) {
        let query = Content.find(condition).populate('author', 'username name email');
        //分页
        let pageInfo = core.createPage(req.query.page, total, 30);
        //console.log(pageInfo);
        query.skip(pageInfo.start);
        query.limit(pageInfo.pageSize);
        query.sort({created: -1});
        query.exec(function(err, results) {
            //console.log(err, results);
            res.render('app/content/list.hbs', {
                layout: 'app_layout',
                title: '内容列表',
                contents: results,
                pageInfo: pageInfo
            });
        });
    });
    
};*/
//单条
exports.one = function(req, res) {
    let id = req.params.id;
    Content.findById(id).populate('tags').populate('author').populate('category').populate('comments').populate('gallery').exec(function(err, result) {
        //console.log(result);
        if(!result) {
            return res.render('app/info.hbs', { layout:'app_layout',
                message: '该内容不存在'
            });
        }
        result.visits = result.visits + 1;
        result.save();
        res.render('app/content/item.hbs', {
            layout:'app_layout',
            title: result.title,
            description:result.content,
            keywords: result.keywords,
            content: result
        });
    });
};