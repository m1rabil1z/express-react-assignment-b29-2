import express from "express"
import { createNote, deleteNote, getAllNotes, updateNote, getNotebyId } from "../controllers/notesControllers.js";

const router = express.Router();

router.get("/", getAllNotes);
router.get("/:id", getNotebyId);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
