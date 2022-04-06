const express = require('express')
const app = express()
const cors=require("cors")
const axios=require("axios")
const PORT = process.env.PORT || 5000
const jwt=require("jsonwebtoken")
const JWT_SECRET="TEST101"

// parse requests of content-type - application/json
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors())

const test_user=[{
    id:1,
    email:"test@gmail.com"
}]

////verify jwt token middleware
const verifyToken=async(req,res,next)=>{
    try{
        if (!req.headers['authorization']) return res.status(401).send({ success:false,message:"please send token in header"}) /// if no token found in headers
        const token = req.headers['authorization'].split(' ')[1]
        if (!token) return response.errorResponse(res, 401, res.__("Not Authorized"))

        const decode = await jwt.verify(token, JWT_SECRET)
        const user=test_user.find((obj)=>obj.id===decode.id) //finding user in user array

        if(user){ //if user found procced.
            next()
        }else{
            throw new Error("user not found")
        }
 

    }catch(e){
        res.status(500).send({
            success:false,
            message:e.message
        })
    }
}

///get random user list
app.get("/api/v1/user",verifyToken,async(req,res,next)=>{
    try{
        const {limit,page,nat}=req.query

        const data=await axios.get(`https://randomuser.me/api/?results=${limit}&page=${page}&nat=${nat}&seed=abcd`)

        res.send({
            success:true,
            data:data.data.results
        })

    }catch(e){
        res.status(500).send({
            success:false,
            message:e.message
        })
    }
})

//send token in client side
app.get("/api/v1/user/get_token",async(req,res,next)=>{
    try{
        const auth_token = jwt.sign({ id: test_user[0].id, email: test_user[0].email }, JWT_SECRET, { expiresIn: "10d" }); /// creating jwt token with test user info
        res.send({
            success:true,
            token:auth_token
        })
    }catch(e){
        res.status(500).send({
            success:false,
            message:e.message
        })
    }
})



app.listen(PORT, () => {
    console.log('server is running at port', PORT)
})