import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    noteId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    text: { type: String, required: true },
    authorID: { type: String, required: true }
}, 
{ timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
