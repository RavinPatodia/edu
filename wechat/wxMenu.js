'use strict';

const fs = require('fs');
const request = require('request');
const config = require('../config');
const wxToken =require('./wxToken');
let menus = {
 "button": [
     {
         "name":"testMenu",
         "sub_button":[
             {
                 "type":"view",
                 "name":"login",
                 "url":""
             }]
     }]
};

let createMenu = function(token){
    let options = {
        url:config.createMenuApi+token,
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
