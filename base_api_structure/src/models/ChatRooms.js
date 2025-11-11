import {Schema  , model} from "mongoose";

const chatRoomSchema = new Schema({
    roomId:{
        type: String,
        required: true,
    },
    senderId:{
        type: String,
        required: true,
    },
    receiverId:{
        type: String,
        required: true,
    },
    users:[{
        type: String,
        required: true,
    }],
    lastMessage:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    },
})

export default model("ChatRoom", chatRoomSchema);