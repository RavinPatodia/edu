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
                        console.log("token:read from file"+token);
                        if(checkValidate(token)){
                            resolve(token.access_token);
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

let reloadToken=function(grantType){
        let queryParams = {
            'grant_type':'client_credential',
            'appid':config.wechat.appID,
            'secret':config.wechat.appsecret
        };
    
        let wxGetAccessTokenBaseUrl = config.wechat.accessTokenApi+qs.stringify(queryParams);
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
                     tokenJson.time=now;
                     fileUtil.writeFile('./wechat/access_token.json',JSON.stringify(tokenJson));
                     console.log("token has writed"+tokenJson.access_token)
                     resolve(tokenJson.access_token);
                 }else{
                     reject(err);
                 }
             });
         });
    };

module.exports = getToken;
