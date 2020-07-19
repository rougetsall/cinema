const express = require('express');
const router = express.Router();
const localStorage = require('node-localstorage');
router.get("/",(req,res) =>{
  if (req.cookies['jwt'] != null) {
    res.render("home");
  }else{
    res.render("index");
  }
});
router.get("/home",(req,res) =>{
  if (req.cookies['jwt'] != null) {
    res.render("home");
  }else{
    res.render("index");
  }
});
router.get("/register",(req,res) =>{
 
  if (req.cookies['jwt'] != null) {
    res.render("home");
  }else{
    res.render("register");
  }
});
router.get("/login",(req,res) =>{
  if (req.cookies['jwt'] != null) {
    res.render("home");
  }else{
    res.render("login");
  }
})
router.get("/logout",(req,res) =>{
  res.clearCookie('jwt')
  res.render("index");
  
})
module.exports = router;