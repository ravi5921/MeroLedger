const mongoose = require('mongoose');

const ExpensesSchema = mongoose.Schema({
    titleOfExpense:{
        type:String,
        default:''
    },
    amountSpent:{
        type:Number,
        default:0
    },
    actualExpense:{
        type:Number,
        default:0
    }
});

const LoansSchema = mongoose.Schema({
    loanGiven:{
        type:Number,
        default:0
    },
    loanTaken:{
        type:Number,
        default:0
    }
});

const MainSchema = mongoose.Schema({   
    month:{
        type:String
    } ,
    monthlyBudget: {
        type: Number,
        default:0
    },
    expectedMonthlyExpenses: {
        type: Number,
        default:0
    },
    expectedMonthlySaving:{
        type:Number
    },
    date: {
        type:Date,
        default:Date.now
    },
    expenses:[ExpensesSchema],
    loans:[LoansSchema]

});

const UsersSchema = mongoose.Schema({
    id: {
        type:String,
        required:true
    },
    main:[MainSchema]
})

module.exports = mongoose.model('Users', UsersSchema);