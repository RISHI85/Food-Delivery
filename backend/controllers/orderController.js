import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//placing user order from frontend
const  placeOrder = async (req,res)=>{
    const frontend_url = "http://localhost:5173"

    try {
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

        const line_items=req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100*80
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:2*100*80
            },
            quantity:1
        })


        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        res.json({success:true,session_url:session.url})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    console.log("Incoming verify request:", { success, orderId });

    if (!orderId) {
        return res.json({ success: false, message: "Missing orderId" });
    }

    try {
        if (String(success) === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            const deleted = await orderModel.findByIdAndDelete(orderId);
            console.log("Deleted Order:", deleted);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.error("Error in verifyOrder:", error);
        res.json({ success: false, message: "Error" });
    }
};

// user orders for frontend
const userOrders = async(req,res)=>{
    try {
        const orders= await orderModel.find({userId:req.userId});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}; 

export {placeOrder,verifyOrder,userOrders}