let express = require('express');
let wechat = require('./wechat/wechat');
let config ={
  token:'test'
};

let app = express();
let wecharApp = new wechat(config);
app.get('/' ,function(req,res){
   wecharApp.auth(req,res);
});

app.listen(3000);
