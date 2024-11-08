import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors"


const prisma = new PrismaClient();
const app = express();

app.use(cors())

app.use(express.json())

app.post('/signup' , async(req , res)=>{
    const {name , email , password , phonenumber} = req.body;

    if(!name || !email || !password){
        res.status(404).json({mssg : "Enter the valid data"})
        
    }

    try {
        const newuser = await prisma.user.create({
            data : {
                name ,
                email ,
                password,
                phone : phonenumber
            }
        })

        console.log(newuser);
        res.status(200).json({mssg : "new user created successfully " , newuser})
    } catch (error) {
       console.error("Error creating user : " , error);
       res.status(500).json({ error : "Error creating user"});
    }

})

app.post("/signin" , async(req , res)=>{
    const {email , password} = req.body;

    if(!email || !password){
        res.status(400).json({mssg : "Enter valid data"})
    }

    try {
        const newuser = await prisma.user.findUnique({
            where : {
                email : email,
            }
        });

        if(!newuser){
            res.status(402).json({mssg : "User does not exist!! login" })
        }

        if(newuser?.password !== password){
            res.status(400).json({mssg : "Incorrect password "});
            return
        }

        console.log(newuser);

        res.status(200).json({ mssg : "User signUp successfully "})
        

    } catch (error) {
        console.error(error);
        res.status(400).json({error : "error while signin try again"})
    }
})

app.listen(6001 , ()=>{
    console.log("server is running on port 6001")
})