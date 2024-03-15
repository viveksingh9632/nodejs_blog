const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    display: {
        type: String, 
        required: true
    },
    ramrom:{
        type: String, 
        required: true
    },

    camera:{
        type: String, 
        required: true

    },
    battery:{
        type: String, 
        required: true

    },
    retail:{
        type: String, 
        required: true
 
    }

});
module.exports=mongoose.model('Brand',brandSchema)