'use strict';

let appPath = process.cwd();
let config = {
    wechat:{
      token:'test',
      appID:'wxabc82c1261260125',
      appsecret:'facef4ec57a5965b24fb3a6a732e4a2e',
      scope:'snsapi_userinfo',
      apiDomain:"https://api.weixin.qq.com",
      oauth2Api:'https://open.weixin.qq.com/connect/oauth2/authorize?',
      oauth2TokenApi:'https://api.weixin.qq.com/sns/oauth2/access_token?',
      userinfoApi:'https://api.weixin.qq.com/sns/userinfo?',
      accessTokenApi:'https://api.weixin.qq.com/cgi-bin/token?',
      createMenuApi:'https://api.weixin.qq.com/cgi-bin/menu/create?access_token='
    },
    port: 7000,
    env: process.env.NODE_ENV || 'development', 
    mongodb: {
      uri: 'mongodb://localhost:27017/blog',
      options: {}
    },
    redis: {
        host: '',
        port: 6379,
        pass: ''
    },
    
    findPasswordTill: 24 * 60 * 60 * 1000,
    sessionSecret: 'SessionSecret',
    jwt: {
        secret: 'JWTSecret',
        options: {
            expiresIn: '10h'
        }
    },
    title: '',
    admin: {
        dir: 'admin',
        role: {
            admin: 'admin',
            user: 'user'
        }
    },
    upload: {
        tmpDir:  appPath + '/public/uploaded/tmp',
        uploadDir: appPath + '/public/uploaded/files',
        uploadUrl:  '/uploaded/files/',
        maxPostSize: 100 * 1024 * 1024, // 100M
        minFileSize:  1,
        maxFileSize:  50 * 1024 * 1024, // 50M
        acceptFileTypes:  /.+/i,
        storage: {
            type: 'local',//保存类型，如果保存到本地可省略或local, 目前支持7牛：qiniu
            options: {
                accessKey: 'your key',
                secretKey: 'your secret',
                bucket: 'your bucket',
                domain: 'http://yourdomain.qiniudn.com', // 域名，包含http，如http://yourdomain.qiniudn.com
                timeout: 3600000, // default rpc timeout: one hour, optional
            }
        }
    },
    stopForumSpam: false,
    userVerify: {
        enable: false,
        type: 'admin' // mail | admin, 默认admin
    },
    // 邮箱配置，找回密码、用户注册使�?
    mail: {
        // 发信人邮�?
        from: '66118181@qq.com',
        // nodemailer config see https://nodemailer.com/about/
        nodemailer: {
            // https://nodemailer.com/smtp/
            service: 'gmail',
            host: '',
            port: '',
            auth: {
                user: '',
                pass: ''
            }
        }
        
    },
    // google analytics
    ga: '',
    // 短信服务配置TODO:
    sms: {

    }
};

module.exports = config;