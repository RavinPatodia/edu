'use strict';

let  mongoose = require('mongoose')
let fs = require('fs')
let path = require('path')
let File = mongoose.model('File')
let _ = require('lodash')
let config = require('../../config')
let core = require('../../libs/core')
let backPath = 'file'
console.log(config.upload)
let uploader = require('../../libs/uploader')(config.upload);
//列表
exports.list = function(req, res) {
    //console.log(req.cookies['XSRF-TOKEN'])
    let condition = {};
    if(req.Roles && req.Roles.indexOf('admin') < 0) {
        condition.author = req.session.user._id;
    }
    File.count(condition, function(err, total) {
        let query = File.find(condition).populate('author');
        //分页
        let pageInfo = core.createPage(req.query.page, total);
        console.log(pageInfo)
        query.skip(pageInfo.start);
        query.limit(pageInfo.pageSize);
        query.sort({created: -1});
        query.exec(function(err, results) {
            console.log(results)
            res.render('server/file/list.hbs', {
                files: results,
                pageInfo: pageInfo,
                Menu: 'file'
            });
        });
    })
};
//添加
exports.add = function(req, res) {
    if (req.method === 'GET') {
        res.render('server/file/add.hbs', {
            Menu: 'file'
        });
    } else if (req.method === 'POST') {
        //console.log(req.files);
        //console.log(req.body);
        console.log(req.headers.host)
        uploader.post(req, res, function (result) {
            console.log('上传结果', result);

            if(!result || !result.files) {
                return;
            }
            let id = req.body.id;
            //如果是修改文件，则不保存到服务器
            if(id) {
                console.log('修改文件');
                File.findById(id).populate('author').exec(function(err, file) {
                    let isAdmin = req.Roles && req.Roles.indexOf('admin') > -1;
                    let isAuthor = file.author && ((file.author._id + '') === req.session.user._id);

                    if(!isAdmin && !isAuthor) {
                        return res.render('server/info.hbs', { layout:'layout-blank',
                            message: '没有权限' ,backPath:backPath
                        });
                    }
                    //TODO: 删除之前的文件 uploader.delete()?
                    fs.unlink(config.upload.uploadDir + '/' + file.name, function(err) {
                        console.log('删除成功', config.upload.uploadDir + '/' + file.name)
                    });
                    // todo: 更新文件信息

                    res.json(result);
                });
                return;
            }
            let len = result.files.length;
            let json = {
                files: []
            };
            result.files.forEach(function(item) {
                if(req.session.user) {
                    item.author = req.session.user._id;
                }
                if(item.url.indexOf('%20')){
                    item.url=item.url.replace("%20"," ");
                }
                //这里还可以处理url
                let fileObj = item;//_.pick(item, 'name', 'size', 'type', 'url');
                console.log(fileObj);
                let file = new File(fileObj);
                file.save(function(err, obj) {
                    if(err || !obj) {
                        console.log('保存file失败', err, obj);
                        return;
                    }
                    len --;
                    item._id = obj._id;
                    json.files.push(item);
                    if(len === 0) {
                        console.log(json)
                        res.json(json);
                    }
                });
            });
        });
    }
};
//删除
exports.del = function(req, res) {
    let id = req.params.id;
    File.findById(id).populate('author').exec(function(err, result) {
        if(!result) {
            return res.render('server/info.hbs', { layout:'layout-blank',
                message: '文件不存在' ,backPath:backPath
            });
        }
        let isAdmin = req.Roles && req.Roles.indexOf('admin') > -1;
        let isAuthor = result.author && ((result.author._id + '') === req.session.user._id);

        if(!isAdmin && !isAuthor) {
            return res.render('server/info.hbs', { layout:'layout-blank',
                message: '没有权限' ,backPath:backPath
            });
        }
        //console.log(result);
        let url = result.url;
        uploader.delete(url, function(e) {
            if (e) {
                console.log('文件删除失败')
                return res.json({
                    success: false,
                    error: e
                });
            }
            result.remove(function(err) {
                if(req.xhr) {
                    return res.json({
                        success: !err,
                        error: err
                    });
                }
                if(err) {
                    return res.render('server/info.hbs', { layout:'layout-blank',
                        message: '删除失败' ,backPath:backPath
                    });
                }
                res.render('server/info.hbs', { layout:'layout-blank',
                    message: '删除成功' ,backPath:backPath
                });
            })
        })
    });
};