'usr strict'
const qs = require('querystring');
const config = require('../../config');
const request = require('request');
const fileUtil = require('../../wechat/fileUtil');
let mongoose = require('mongoose')
let TokenModel = mongoose.model('Token')

exports.wxGetCode = function(req,res){
   let router = 'get_wx_access_token';
   let return_uri=''+router;
   let queryParams = {
    'appid':config.wechat.appID,
    'redirect_uri':return_uri,
    'response_type':'code',
    'scope':config.wechat.scope,
    'state':'STATE'
   };

   let wxOauthBaseUrl = config.wechat.oauth2Api+qs.stringify(queryParams)+'#wechat_redirect';
   res.redirect(wxOauthBaseUrl);
};

let getUserInfo = function(token){
    let reqUrl = config.wechat.userinfoApi;

    let requestPatams = {
        access_token:token,
        openid:config.wechat.appID,
        lang:'zh_CN'
    };

    let options ={
        method:'get',
        url:reqUrl+qs.stringify(requestPatams)
    };
    return new Promise(function(resolve,reject){
        request(options,function(err,res,body){
            if(res){
                let userinfo = JSON.parse(body);
                console.log('get userinfo successful');
                resolve(userinfo);
                res.send("\
                     <h1>" + userinfo.nickname +" 的个人信息</h1>\
                     <p><img src='"+userinfo.headimgurl+"' /></p>\
                     <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
                 ");
            } else {
                reject(err);
            }
        });
    })
};
let checkValidate= function(token){
    let now = new Date();
    let time = new Date(token.time);
    return now.getTime() - time.getTime() <0;
};
let getToken=function(code){

        return new Promise(function(resolve,reject){
            let condition={};
            condition.type=tokenType;
            TokenModel.find(condition).exec(function(err,result){
                if(checkValidate(result)){
                   resolve(result.access_token);
                };
                reloadToken(code);
            });
            
        });
};
let reloadToken=function(code){
        let queryParams = {
            'appid':config.wechat.appID,
            'secret':config.wechat.appsecret,
            'code':code,
            'grant_type':'authorization_code'
        };
    
        let wxGetAccessTokenBaseUrl = config.wechat.oauth2TokenApi+qs.stringify(queryParams);
        let options ={
            method:'GET',
            url:wxGetAccessTokenBaseUrl
        };
        return new Promise(function (resolve,reject){
             request(options,function(err,res,body){
                 if(res){
                     let tokenJson = JSON.parse(body);
                     console.log("token:get from net"+tokenJson)
                     let now = new Date();
                     now.setSeconds(now.getSeconds() + tokenJson.expires_in);
                     let obj ={};
                     obj.access_token=tokenJson.access_token;
                     obj.expires_in=now;
                     let token = new TokenModel(obj);
                     token.save(function(err,result){
                        if(err){
                            reject(err);
                        }
                        resolve(tokenJson.access_token);
                     });
                     
                 }else{
                     reject(err);
                 }
             });
         });
    };
exports.userinfo = function(req,res){
    let wxcode = req.query.code;
    getToken(wxcode).then(function(access_token){
        let userinfo = getUserInfo(access_token);
        res.send("\
                         <h1>" + userinfo.nickname +" 的个人信息</h1>\
                         <p><img src='"+userinfo.headimgurl+"' /></p>\
                         <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
                     ");
    }).catch(function(err){
        console.log(err);
    });
};