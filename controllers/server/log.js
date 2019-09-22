'use strict';

let mongoose = require('mongoose')
let Log = mongoose.model('Log')
let core = require('../../libs/core')

//列表
exports.list = function(req, res) {
    let condition = {};
    if(req.Roles && req.Roles.indexOf('admin') < 0) {
        condition.author = req.session.user._id;
    }
    Log.count(condition, function(err, total) {
        let query = Log.find(condition);
        //分页
        let pageInfo = core.createPage(req.query.page, total);
        //console.log(pageInfo);
        query.skip(pageInfo.start);
        query.limit(pageInfo.pageSize);
        query.sort({created: -1});
        query.exec(function(err, results) {
            //console.log(err, results);
            res.render('server/log/list.hbs', {
                title: '日志列表',
                Menu:'log',
                logs: results,
                pageInfo: pageInfo
            });
        })
    })
};

//单条
exports.one = function(req, res) {
    let id = req.params.id;
    Log.findById(id).populate('author', 'username name').exec(function(err, result) {
        console.log(result);
        if(!result) {
            return res.render('server/info.hbs', { layout:'layout-blank',
                message: '该页面不存在'
            });
        }
        res.render('server/log/item.hbs', {
            title: '日志详情',
            Menu:'log',
            log: result
        });
    });
};
//删除
exports.del = function(req, res) {
    let id = req.params.id;
    Log.findById(id).populate('author').exec(function(err, result) {
        if(!result) {
            return res.render('server/info.hbs', { layout:'layout-blank',
                message: '留言不存在'
            });
        }
        let isAdmin = req.Roles && req.Roles.indexOf('admin') > -1;
        let isAuthor = result.author && ((result.author._id + '') === req.session.user._id);

        if(!isAdmin && !isAuthor) {
            return res.render('server/info.hbs', { layout:'layout-blank',
                message: '没有权限'
            });
        }
        console.log(result)
        result.remove(function(err) {
            if (req.xhr) {
                return res.json({
                    status: !err
                });
            }
            if(err) {
                return res.render('server/info.hbs', { layout:'layout-blank',
                    message: '删除失败'
                });
            }
            res.render('server/info.hbs', { layout:'layout-blank',
                message: '删除成功'
            })
        });
    });
};
