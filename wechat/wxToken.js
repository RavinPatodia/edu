'usr strict';
const util = require('util');
const fileUtil = require('./fileUtil');
const fs = require('fs');
const request = require('request');
const qs = require('querystring');
const config = require('../config');

let checkValidate= function(token){
    let now = new Date();
    let time = new Date(token.time);
    return now.getTime() - time.getTime() <0;
};
let getToken=function(){
        return new Promise(function(resolve,reject){
            fs.exists('./wechat/access_token.json',function(exists){
                if(exists){
                    
                    let token = fileUtil.readFile('./wechat/access_token.json');
                    token =token?JSON.parse(token.trim()):token;
                    if(token){
                        if(this.checkValidate(token)){
                            resolve(token);
                        }else{
                            reloadToken();
                        }
                    }else{
                        reloadToken();
                    }
                }else{
                    reloadToken();
                }
            });
            
        });
    };

let reloadToken=function(){
        let queryParams = {
            'grant_type':'client_credential',
            'appid':config.appID,
            'secret':config.appSecret
        };
    
        let wxGetAccessTokenBaseUrl = config.accessTokenApi+qs.stringify(queryParams);
        let options ={
            method:'GET',
            url:wxGetAccessTokenBaseUrl
        };
        return new Promise(function (resolve,reject){
             request(options,function(err,res,body){
                 if(res){
                     let tokenJson = JSON.parse(body);
                     let now = new Date();
                     now.setSeconds(now.getSeconds() + tokenJson.expires_in);
                     tokenJson.time=now;
                     fileUtil.writeFile('./wechat/access_token.json',JSON.stringify(tokenJson));
                     resolve(tokenJson);
                 }else{
                     reject(err);
                 }
             });
         });
    };

module.exports = getToken;
