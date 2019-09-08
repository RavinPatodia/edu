'usr strict';
const util = require('util');
const fs = require('fs');
const request = require('request');
const qs = require('querystring');
const config = require('../config');
const ACCESS_TOKEN_FILE = require('./accessToken');
var token={
    checkValidate: function(token){
        let now = new Date();
        let time = new Date(token.time);
        return now.getTime() - time.getTime() <0;
    },
    getToken: function(){
        return new Promise(function(resolve,reject){
            fs.exists(ACCESS_TOKEN_FILE,function(exists){
                if(exists){
                    let token = fs.readFile(ACCESS_TOKEN_FILE);
                    token =token?JSON.parse(token.trim()):token;
                    if(token){
                        if(this.checkValidate(token)){
                            resolve(token);
                        }else{
                            this.reloadToken();
                        }
                    }else{
                        this.reloadToken();
                    }
                }else{
                    this.reloadToken();
                }
            });
            
        });
    },
    reloadToken: function(){
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
        return new Promise((resolve,reject) =>{
             request(options,function(err,res,body){
                 if(res){
                     let tokenJson = JSON.parse(body);
                     let now = new Date();
                     now.setSeconds(now.getSeconds() + tokenJson.expires_in);
                     tokenJson.time=now;
                     fs.writeFile(ACCESS_TOKEN_FILE,token,JSON.stringify(tokenJson));
                     resolve(tokenJson);
                 }else{
                     reject(err);
                 }
             });
         })
    }

}
module.exports = token;
