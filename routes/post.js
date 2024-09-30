import express from "express";
import { createPost, getPosts } from "../controllers/post.js";
import isLoggedIn from '../middlewares/isLoggedIn.js'
import upload from '../config/multer.js'

const router=express.Router();

router.post('/create',isLoggedIn,upload.single('image'),createPost);
router.get('/find',isLoggedIn,getPosts);

export default router;