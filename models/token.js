'use strict';

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let TokenSchema = new Schema({
    access_token:{
        type:String
    },
    expires_in:{
        type:Number,
        default: 0
    }
});

TokenSchema.methods={
    
};

mongoose.model('Token',TokenSchema);
