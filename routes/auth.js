import express from "express";
import {login,logout,profile,register} from '../controllers/auth.js'
import isLoggedIn from '../middlewares/isLoggedIn.js'

const router=express.Router();

router.post('/login',login);
router.post('/register',register);
router.get('/profile/:username',isLoggedIn,profile);
router.post('/logout',logout);

export default router;