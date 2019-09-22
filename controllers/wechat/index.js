'use strict';

const wxAuth = require('../../wechat/wxAuth');
const wxToken =require('../../wechat/wxToken');
const wxMenu =require('../../wechat/wxMenu');

exports.auth = function(req,res){
    wxAuth(req,res);
};

exports.getAccessToken = function(req,res){
    wxToken().then(function(data){
        res.send(data);
      });
};

exports.createMenu = function(req,res){
    wxToken().then(function(data){
        console.log("server token"+data);
        wxMenu(data);
      });
}