const pool =require("../utils/dbpool")
const {apiSuccess,apiError}=require("../utils/apiresult")
const express = require("express")
const router = express.Router()

router.get('/admins',(req,res)=>{
    pool.query("SELECT *FROM admins",(err,result)=>{
        if(err)
            return res.status(500).json(err);
        res.json(results);
    });
});

router.post('/admins/login',(req,res)=>{
    const {username,password}=req.body;
    pool.query("SELECT * FROM admins WHERE username = ? AND password = ?",[username,password],(err,result)=>{
        if(err)
            return res.status(500).json(err);
        if(result.length > 0)
            return res.json(result[0]);
        res.status(401).json({messege:'Invalid admin credentials'});
    });
});

router.put('/admins/:id',(req,res)=>{
    const {id} = req.params;
    const { username,password,role } =req.body;
    pool.query('UPDATE admins SET username =?,password = ?,role = ? WHERE id = ?',[username,password,role,id],(err,result)=>{
        if (err) return res.status(500).json(err);
        res.json({messege:'Admin updated'});
    });
});

router.delete('/admins/:id',(req,res)=>{
    const { id } = req.params;
    pool.query('DELETE FROM admins WHERE id = ?',[id],(err,result)=>{
        if(err)
            return res.status(500).json(err);
        res.json({messege: 'Admin deleted' });
    });
});

 module.exports = router;