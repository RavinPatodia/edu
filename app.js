const express = require('express');
const wechat = require('./wechat/wechat');
var config ={
  token:'test',
  appID:'wxabc82c1261260125',
  appsecret:'facef4ec57a5965b24fb3a6a732e4a2e',
  apiDomain:'https://api.weixin.qq.com',
  accessTokenApi:'%scgi-bin/token?grant_type=client_credential&appid=%s&secret=%s'
};

let app = express();
let wecharApp = new wechat(config);
app.get('/' ,function(req,res){
   console.log("listening");
   wecharApp.auth(req,res);
});

app.get('/getAccessToken',function(req,res){
  wecharApp.getAccessToken().then(function(data){
    res.send(data);
  });
});

app.listen(3000);
