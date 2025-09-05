import { log } from "console";
import foodModel from "../models/foodModel.js";
import fs from "fs";


//add food item

const addFood = async (req, res) => {

    console.log("im triggered in foodController.js");
    if (!req.file) {
    res.status(400).json({ success: false, message: 'Image file is missing' });
    }
    console.log("Content-Type:", req.headers['content-type']);
    console.log("req.file:", req.file); 
    console.log("req.body:", req.body); 

        const imageName = req.file.filename;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: imageName
        });
    try {
      await food.save();
      res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error adding food" });
    }
};

//all food list
const listFood = async (req, res) => {
    try {
        const foods=await foodModel.find({});
        res.json({success: true, data:foods});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error getting foods" });
    }
}

//remove food item

const removeFood = async (req, res) => {
    try {
        const id = req.body.id;
        console.log("Incoming ID:", id);

        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        fs.unlink(`uploads/${food.image}`, () => {});
        await foodModel.findByIdAndDelete(id);

        res.json({ success: true, message: "Food removed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing food" });
    }
};


export {addFood,listFood,removeFood}