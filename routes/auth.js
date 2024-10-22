import express from "express";
import {followUser, getUser, login,logout,profile,register,search, setProfilePic} from '../controllers/auth.js'
import isLoggedIn from '../middlewares/isLoggedIn.js'
import upload from "../config/multer.js";

const router=express.Router();

router.post('/login',login);
router.post('/register',register);
router.get('/profile/:username',isLoggedIn,profile);
router.get('/search/:friend',isLoggedIn,search);
router.get('/user/:userId',isLoggedIn,getUser);
router.post('/pic/:userId',isLoggedIn,upload.single('pic'),setProfilePic);
router.post('/logout',logout);
router.post('/follow/:username',isLoggedIn,followUser);

export default router;