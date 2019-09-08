let express = require('express');
let crypto = require('crypto');
let config ={
  token:'test'
};

let app = express();

app.get('/' ,function(req,res){
  let signature = req.query.signature;
  let timestamp = req.query.timestamp;
  let nonce =req.query.nonce;
  let echostr = req.query.echostr;

  let array = [config.token,timestamp,nonce];
  array.sort();
  
  let tempStr = array.join('');
  const hashCode = crypto.createHash('sha1');
  let resultCode = hashCode.update(tempStr,'ytf8').digest('hex');
 
  if(resultCode === signature){
    res.send(echostr);
  }else{
    res.send('error');
  }
});

app.listen(3000);
