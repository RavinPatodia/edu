'usr strict'
const crypto = require('crypto');
const qs = require('querystring');
const config = require('../config');

let auth = function(req,res){

    let signature = req.query.signature;
    let timestamp = req.query.timestamp;
    let nonce =req.query.nonce;
    let echostr = req.query.echostr;
  
    let array = [config.token,timestamp,nonce];
    array.sort();
    
    let sortStr = array.join('');
    const hashCode = crypto.createHash('sha1');
    let sha1Str = hashCode.update(sortStr,'ytf8').digest('hex');
   
    if(sha1Str === signature){
      res.send(echostr);
    }else{
      res.send('error');
    }
  }
module.exports = auth;