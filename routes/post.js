import express from "express";
import { createPost, getPosts } from "../controllers/post.js";
import isLoggedIn from '../middlewares/isLoggedIn.js'

const router=express.Router();

router.post('/create',isLoggedIn,createPost);
router.get('/find',isLoggedIn,getPosts);

export default router;