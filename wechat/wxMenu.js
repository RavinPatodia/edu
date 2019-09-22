'use strict';

const fs = require('fs');
const request = require('request');
const config = require('../config');
const wxToken =require('./wxToken');
let menus = {
 "button": [
     {
         "name":"课程",
         "sub_button":[
             {
                 "type":"view",
                 "name":"查询",
                 "url":"https://www.baidu.com/"
             }]
     },
     {    
          "type":"view",
          "name":"成绩",
          "url":"https://www.baidu.com/"
      },
      {    
          "type":"view",
          "name":"反馈",
           "url":"https://www.baidu.com/"
        }]
};

let createMenu = function(token){
    let options = {
        url:config.wechat.createMenuApi+token,
        form:JSON.stringify(menus),
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    request.post(options,function(err,res,body){
        if(err){ 
            console.log(err);
        }else{
            console.log(body);
        }
    })
}

module.exports=createMenu;
