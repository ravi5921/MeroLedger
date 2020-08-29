const express = require('express');
const router = express.Router();
const Investments = require('../models/Investment');

router.get('/',async (req,res)=>{
    try{
        const investments = await Investments.find();
        res.json(investments);
    }catch(err){
        res.json({message:err});
    }
});

router.post('/',async (req,res)=>{
    const newInvestment = new Investments({
        id:req.body.id,
        image:req.body.image,
        title:req.body.title,
        link:req.body.link
    })
    try{
        const savedInvestments = await newInvestment.save()
        res.json(savedInvestments);
    }catch(err){
        res.json({message:err});
    }
})

module.exports = router;