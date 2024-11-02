import express from "express"

const app = express()
const PORT = 3000;

app.get("/get" , async(req , res)=>{
    console.log("hi from the get funciton ")
    res.json({mssg : "hello from the get funciton"});
})


app.listen(PORT);