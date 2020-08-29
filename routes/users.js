const express = require('express');
const router = express.Router();
const Users = require('../models/Users');


//GETS all the budget(development only)
router.get('/',async (req,res) =>{
    try{
        const users = await Users.find();
        res.json(users);

    }catch(err){
        res.json({message:err});
    }


});

//GET specific user data
router.get('/:id',async (req,res) =>{
    try{
        const user = await Users.findOne({id:req.params.id});
        res.json(user);

    }catch(err){
        res.json({message:err});
    }


});

//SUBMIT a post
router.post('/',async (req,res) => {
    let monthlyBudget=await req.body.monthlyBudget;
    let expectedMonthlyExpenses=await req.body.expectedMonthlyExpenses;
    let expectedMonthlySaving=await (monthlyBudget-expectedMonthlyExpenses);
    const user= await Users.findOne({id:req.body.id});
    if(user){
        user.main.push({
            month:req.body.month,
            monthlyBudget,
            expectedMonthlyExpenses,
            expectedMonthlySaving
        });
        try {
            const savedUsers = await user.save() 
            res.json(savedUsers);
            }catch(err){
                res.json({message: err});
            } 
        
    }else{
        const newUser = new Users({
            id:req.body.id,
            main:[{
                month:req.body.month,
                monthlyBudget,
                expectedMonthlyExpenses,
                expectedMonthlySaving
            }]
        });
        try {
            const savedUsers = await newUser.save() 
            res.json(savedUsers);
            }catch(err){
                res.json({message: err});
            } 
        
        
    }

    // users.update({ id:req.body.id, main[0].monthlyBudget})
    
 
});

router.put('/:id/:month/expenses',async(req,res)=>{
    try{
        console.log(req.body)
        const users= await Users.findOne({ id:req.params.id},(err,user)=>{
            const monthlyReports=user.main;
            monthlyReports.map(monthlyReport=>{
                if(monthlyReport.month===req.params.month){
                    monthlyReport.expenses.push({
                        titleOfExpense:req.body.titleOfExpense,
                        amountSpent:req.body.amountSpent,
                        actualExpense:req.body.amountSpent
                    })
                    user.save(err=>{
                        if(err){
                            console.log(err);
                        }
                        return res.json(user)
                    });
                    
                }
            })
        });

    }catch(err){
        res.json({message:err});
    }
})

router.get('/:id/:month/expenses',async(req,res)=>{
        Users.findOne({ id:req.params.id},(err,user)=>{
            if(err){
                return res.json(err);
            }
            let monthlyReports=user.main;
            monthlyReports.map(monthlyReport=>{
                if(monthlyReport.month===req.params.month){
                    let totalExpense=0;
                    monthlyReport.expenses.map(expense=>{
                        totalExpense+=expense.actualExpense;
                    })
                    monthlyReport.expenses.push({
                        titleOfExpense:"Total",
                        actualExpense:totalExpense
                    });
                    return res.json(monthlyReport.expenses)
                }
            })
          
            
        });

})
router.put('/:id/:month/loans',(req,res)=>{
    try{
    Users.findOne({ id:req.params.id},(err,user)=>{
        const monthlyReports=user.main;
        monthlyReports.map(monthlyReport=>{
            if(monthlyReport.month===req.params.month){
                monthlyReport.loans.push(req.body)
                user.save(err=>{
                    if(err){
                        console.log(err);
                    }
                    return res.json(user)
                });

            }

        })
    } );
    }catch(err){
        res.json({message:err});
    }
})

router.get('/:id/:month/loans',async(req,res)=>{
    Users.findOne({ id:req.params.id},(err,user)=>{
        if(err){
            return res.json(err);
        }
        let monthlyReports=user.main;
        monthlyReports.map(monthlyReport=>{
            if(monthlyReport.month===req.params.month){

                return res.json(monthlyReport.loans)
            }
        })
      
        
    });

})

module.exports = router ;