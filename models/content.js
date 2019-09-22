'use strict';

/**
 * 模块依赖
 */
let mongoose = require('mongoose')
let Schema = mongoose.Schema

/**
 * 内容模型
 */
let ContentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String  
    },
    content: {
        type: String,
        required: true
    },
    keywords:{
        type: String
    },
    gallery: [{
        type: Schema.ObjectId,
        ref: 'File'
    }],
    thumb:{
        type: Schema.ObjectId
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category'
    },
    tags: [{
        type: Schema.ObjectId,
        ref: 'Tag'
    }],
    created: {
        type: Date,
        default: Date.now
    },
    visits: {
        type: Number,
        default: 0
    },
    comments: [{
        type: Schema.ObjectId,
        ref: 'Comment'
    }],
    status: {
        type: Number,
        default: 0
    },
    //喜欢
    like: {
        type: Number,
        default: 0
    },
    //置顶，权重由数值决定
    up: {
        type: Number,
        default: 0
    },

});

/*ContentSchema.pre('save', function(next) {
    if (!this.isNew) return next();
    if (!this.title) {
        next(new Error('Invalid password'));
    } else {
        next();
    }
});*/

ContentSchema.methods = {

};

mongoose.model('Content', ContentSchema);