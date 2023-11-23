require("dotenv").config();


const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
/*
app.use(cors({
    origin:"http://localhost:5173/",
}));
*/
const storeItems = new Map([
    [1, {priceInCent: 1000, name: ""}]
])


const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

app.post("/create-checkout-session", async(req,res)=>{
    try{
       const {items} = req.body
        console.log(items)
        const session = await stripe.checkout.sessions.create({    
            payment_methods_types:["card"],
            mode:"payment",
            line_items: items.map(item => {     // req.body.items
                  console.log(item)
                  console.log(item.name)            
                return{
                    price_data:{
                        currency:"usd",
                        product_data:{
                            name: item.name
                        },
                        unit_amount:(item.price)*100,
                    },
                    quantity:item.quantity
                }
            
            }),
    
            success_url: 'http://localhost:5173/success',
            cancel_url: 'http://localhost:5173/cancel'
        }) 
        res.json({url: session.url})
      //  res.redirect(303, session.url);

    }catch(e){
        console.log(" this error")
        res.status(500).json({error:e.message})
    }
})




app.listen(5000,()=>{
    console.log("server is connected")
})