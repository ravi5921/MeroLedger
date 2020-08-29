const mongoose = require('mongoose');

const InvestmentSchema = mongoose.Schema({
    id:Number,
    image:String,
    title:String,
    link:String
})

module.exports = mongoose.model('Investment', InvestmentSchema);