import mongoose from "mongoose";

const HashtagsSchema = new mongoose.Schema({
    hashtag:{
        type:String,
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"InstagramPost",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
});
export default mongoose.model("Hashtags",HashtagsSchema);

