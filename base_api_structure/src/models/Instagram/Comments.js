import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    comment:{
        type: String,
        required: true
    },
    replies:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: []
    }],
    likes:{
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

export default mongoose.model("Comment", commentSchema);