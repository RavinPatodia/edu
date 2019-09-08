'usr strict'
const crypto = require('crypto');
const https = require('https');
const util = require('util');
const fs = require('fs');
const request = require('request');
const qs = require('querystring');

var weChat = function(config){
    this.config = config;
    this.token = config.token;
    this.appID = config.appID;
    this.appSecret = config.appsecret;

    this.requestGet = function(url){
        return new Promise(function(resolve,reject){
            https.get(url,function(res){
                var buffer = [],result = "";
                res.on('data',function(data){
                    buffer.push(data);
                });
                res.on('end',function(){
                    result = Buffer.concat(buffer,buffer.length).toString('utf-8');
                    resolve(result);
                });
            }).on('error',function(err){
                reject(err);
            });
        });
    }
}

weChat.prototype.auth = function(req,res){
  
  this.getAccessToken().then(function(data){
    let options={
        url:'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + data,
        form: JSON.stringify(menus),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    request.post(options,function(err,res,body){
        if(err){
            console.log(err)
        }else{
            console.log(body);
        }
    });
  });
  
  let signature = req.query.signature;
  let timestamp = req.query.timestamp;
  let nonce =req.query.nonce;
  let echostr = req.query.echostr;

  let array = [this.token,timestamp,nonce];
  array.sort();
  
  let tempStr = array.join('');
  const hashCode = crypto.createHash('sha1');
  let resultCode = hashCode.update(tempStr,'ytf8').digest('hex');
 
  if(resultCode === signature){
    res.send(echostr);
  }else{
    res.send('error');
  }
}

weChat.prototype.getAccessToken = function(){
    var that = this;

    let queryParams = {
        'grant_type':'client_credential',
        'appid':that.appID,
        'secret':that.appSecret
    };

    let wxGetAccessTokenBaseUrl = 'https://api.weixin.qq.com/cgi-bin/token?'+qs.stringify(queryParams);
    let options ={
        method:'GET',
        url:wxGetAccessTokenBaseUrl
    };
    return new Promise((resolve,reject) =>{
         request(options,function(err,res,body){
             if(res){
                 resolve(JSON.parse(body));
             }else{
                 reject(err);
             }
         });
     })
}

let menus={
    "button": [
       {
           "name":"ceshi",
           "sub_button":[{
            "type":"view",
            "name":"authLogin",
            "url":""
           }]
       }]
};

module.exports = weChat;
