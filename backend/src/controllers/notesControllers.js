import Note from "../models/Note.js"
import Comment from "../models/Comment.js"

export async function getAllNotes(_, res) {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getAllNotes controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getNotebyId(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found!" });
        res.json(note);
    } catch (error) {
        console.error("Error in getNotebyId controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function createNote(req, res) {
    try {
        const { title, content, authorID } = req.body;
        if (!authorID) return res.status(400).json({ message: "Browser authID is required" });
        
        const note = new Note({ title, content, authorID });
        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (error) {
        console.error("Error in createNote controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateNote(req, res) {
    try {
        const { title, content } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        if (!updatedNote) return res.status(404).json({ message: "Note not found" });
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error in updateNote controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteNote(req, res) {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) return res.status(404).json({ message: "Note not found" });
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error in deleteNote controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getCommentsbyNote(req, res) {
    try {
        const comments = await Comment.find({ noteId: req.params.id }).sort({ createdAt: -1 });
        res.status(200).json({ comments });
    } catch (error) {
        console.log("Error in getCommentsbyNote controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function createComment(req, res) {
    try {
        const { text, authorID } = req.body;
        if (!text || !authorID) {
            return res.status(400).json({ message: "Comment text and authorID are required" });
        }
        const comment = new Comment({ noteId: req.params.id, text, authorID });
        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        console.log("Error in createComment controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteComment(req, res) {
    try {
        const { authorID } = req.body;
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (comment.authorID !== authorID) {
            return res.status(403).json({ message: "Forbidden! You didn't write the message" });
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.log("Error in deleteComment controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getProfileHistory(req, res) {
    try {
        const { authorID } = req.params;
        const [myNotes, myComments] = await Promise.all([
            Note.find({ authorID }).sort({ createdAt: -1 }),
            Comment.find({ authorID }).sort({ createdAt: -1 })
        ]);
        res.status(200).json({ notes: myNotes, comments: myComments });
    } catch (error) {
        console.log("Error in getProfileHistory controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
