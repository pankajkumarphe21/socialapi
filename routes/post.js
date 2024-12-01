import express from "express";
import { createPost, getUserPosts,getPosts, deletePosts, getPost, editPost, likePost } from "../controllers/post.js";
import isLoggedIn from '../middlewares/isLoggedIn.js'
import upload from '../config/multer.js'

const router=express.Router();

router.post('/create',isLoggedIn,upload.single('image'),createPost);
router.get('/find',isLoggedIn,getPosts);
router.get('/find/:userId',isLoggedIn,getUserPosts);
router.get('/:postId',isLoggedIn,getPost);
router.post('/edit/:postId',isLoggedIn,upload.single('image'),editPost);
router.post('/like/:postId',isLoggedIn,likePost);
router.delete('/delete/:postId',isLoggedIn,deletePosts);

export default router;