'usr strict'
let crypto = require('crypto');

var weChat = function(config){
    this.config = config;
    this.token = config.token;
    this.appID = config.appID;
    this.appScrect = config.appScrect;
    this.apiDomain = config.apiDomain;
    this.accessTokenApi = config.accessTokenApi;

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
    return new Promise(function(resolve,reject){
        var currentTime = new Date().getTime();
        var url = util.format(that.apiURL.accessTokenApi,that.apiDomain,that.appID,that.appScrect);
        if(accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime){
            that.requestGet(url).then(function(data){
                var result = JSON.parse(data); 
                if(data.indexOf("errcode") < 0){
                    accessTokenJson.access_token = result.access_token;
                    accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
                    fs.writeFile('./wechat/access_token.json',JSON.stringify(accessTokenJson));
                    resolve(accessTokenJson.access_token);
                }else{
                    reject(result);
                } 
            });
        }else{
            resolve(accessTokenJson.access_token);  
        }
    });
}

module.exports = weChat;
