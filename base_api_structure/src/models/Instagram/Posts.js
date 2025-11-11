import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    caption:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    likes:{
        type: Number,
        default: 0
    },
    comments:{
        type: Number,
        default: 0
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

export default mongoose.model("Post", postSchema);