import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 2,
        maxLength: 50,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        trim: true,
       
        required: [true, "Name is required"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minLength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ["customer","seller","admin"],
        default: "customer"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        select: false
    },
    refreshToken: {
        type: String,
        select: false
    },
    resetPasswordToken : {
        type: String,
        select: false
    },
    resetPasswordExpires : {
        type: Date,
        select: false
    }

},{timestamps: true})

export default mongoose.model("User",userSchema)