const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config()
app.use(express.json());
app.use(cors({origin:"*"}))
// app.use(cors({origin:"http://localhost:5173"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.get("/", async(req,res)=>{
    res.send("home")
})


const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

app.post("/checkout",async(req,res)=>{
    const item = req.body.items
    console.log(item)
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            line_items:req.body.items.map(item=>{
                return{
                    price_data:{
                        currency:"inr",
                        product_data:{
                            name:item.name
                        },
                        unit_amount:(item.price)*100,
                    },
                    quantity:item.quantity
                }
            }),
            success_url:"http://localhost:5173/success",
            cancel_url:"http://localhost:5173/cancel"
        })
        res.json({url:session.url})
    }catch(error){
    res.status(500).json({error:error.message})
    }
})

app.listen(8000,()=>{
    console.log("server is connected to port 8000")
})