import express from "express";
import { createPost, getUserPosts,getPosts, deletePosts, getPost, editPost } from "../controllers/post.js";
import isLoggedIn from '../middlewares/isLoggedIn.js'
import upload from '../config/multer.js'

const router=express.Router();

router.post('/create',isLoggedIn,upload.single('image'),createPost);
router.get('/find/:userId',isLoggedIn,getUserPosts);
router.get('/:postId',isLoggedIn,getPost);
router.post('/edit/:postId',isLoggedIn,upload.single('image'),editPost);
router.get('/find',isLoggedIn,getPosts);
router.delete('/delete/:postId',isLoggedIn,deletePosts);

export default router;