import express from "express"
import { createNote, deleteNote, getAllNotes, updateNote, getNotebyId, getCommentsbyNote, createComment, deleteComment, getProfileHistory } from "../controllers/notesControllers.js";

const router = express.Router();

router.get("/", getAllNotes);
router.get("/:id", getNotebyId);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

router.get("/:id/comments",getCommentsbyNote);
router.post("/:id/comments",createComment);
router.delete("/comments/:commentId", deleteComment);

router.get("/profile/:authorID", getProfileHistory);

export default router;
