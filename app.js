const express = require('express');
const wxAuth = require('./wechat/wxAuth');
const wxToken =require('./wechat/wxToken');
let app = express();
app.get('/' ,function(req,res){
   console.log("listening");
   wxAuth(req,res);
});

app.get('/getAccessToken',function(req,res){
  wxToken().then(function(data){
    res.send(data);
  });
});

app.listen(3000);
