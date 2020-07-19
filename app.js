const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const localStorage = require('node-localstorage');
const assert = require("assert");
const app = express();
dotenv.config({ path: './.env'});
const  db = mysql.createConnection({
  host     : 'localhost',
  port: 8889,
  user     : 'root',
  password : 'root',
  database : 'cinema'
});
app.use(cookieParser()); 
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.set('view engine','hbs')
app.use(express.urlencoded({extended: false}));
app.use(express.json());
db.connect((error)=>{
  if (error) {
    console.log(error)
  }else{
    console.log("connection mysql is ok")
  }
})
app.get('/film',(req,res)=>{

  if (req.cookies['jwt'] != null) {
   
    db.query('SELECT * FROM films  INNER JOIN genres ON films.id_genre = genres.id_genre LIMIT 30',(error,results)=>{
      if (error) {
          console.log(error) ;               
         }else{
           var rest = [];
           for (let index = 0; index < results.length; index++) {
             rest.push(results[index]);
           }
             console.log(rest);
             res.render('film',{
               resultats: rest
             })
         }
   })
  }else{
    res.render("index");
  }
  
});
app.get('/film/:id',(req,res)=>{

  if (req.cookies['jwt'] != null) {
    db.query(`SELECT * FROM films WHERE id_film = ${req.params.id}`,(error,results)=>{
      if (error) {
          console.log(error) ;               
         }else{
           var rest = [];
           for (let index = 0; index < results.length; index++) {
             rest.push(results[index]);
           }
             console.log(rest);
             res.render('filmid',{
               resultats: rest
             })
         }
   })
  }else{
    res.render("index");
  }
  
});
app.get('/updatefilm/:id',(req,res)=>{

  if (req.cookies['jwt'] != null) {
    db.query(`SELECT * FROM films WHERE id_film = ${req.params.id}`,(error,results)=>{
      if (error) {
          console.log(error) ;               
         }else{
           var rest = [];
           for (let index = 0; index < results.length; index++) {
             rest.push(results[index]);
           }
             console.log(rest);
             res.render('updatefilm',{
               resultats: rest
             })
         }
   })
  }else{
    res.render("index");
  }
  
});

app.post('/updatefilm/:id',(req,res)=>{
  console.log(req.body);
  const { titre, resum } = req.body;
  if (req.cookies['jwt'] != null) {
    db.query(`UPDATE films SET ? WHERE id_film = ${req.params.id}`,{titre: titre, resum: resum},(error,results)=>{
      if (error) {
       console.log(error) ;               
      }else{
        db.query('SELECT * FROM films  INNER JOIN genres ON films.id_genre = genres.id_genre LIMIT 30',(error,results)=>{
          if (error) {
              console.log(error) ;               
             }else{
               var rest = [];
               for (let index = 0; index < results.length; index++) {
                 rest.push(results[index]);
               }
                 console.log(rest);
                 res.render('film',{
                   resultats: rest,
                   message: 'UPDATE reussi!!!'
                 })
             }
       })
      }
  })
    
  }else{
    res.render("index");
  }
  
});

app.get('/deletefilm/:id',(req,res)=>{
  if (req.cookies['jwt'] != null) {
    db.query(`DELETE FROM films WHERE id_film = ${req.params.id}`,(error,results)=>{
      if (error) {
       console.log(error) ;               
      }else{

        db.query('SELECT * FROM films  INNER JOIN genres ON films.id_genre = genres.id_genre LIMIT 30',(error,results)=>{
          if (error) {
                console.log(error) ;               
               }else{
                 var rest = [];
                 for (let index = 0; index < results.length; index++) {
                   rest.push(results[index]);
                 }
                   console.log(rest);
                   res.render('film',{
                     resultats: rest,
                     message: 'DELETE reussi!!!'
                   })
               }
         })
      }
  })
    
  }else{
    res.render("index");
  }
  
});
app.get('/distributeur',(req,res)=>{

  if (req.cookies['jwt'] != null) {
    db.query('SELECT * FROM distributeurs LIMIT 30',(error,results)=>{
      if (error) {
          console.log(error) ;               
         }else{
           var rest = [];
           for (let index = 0; index < results.length; index++) {
             rest.push(results[index]);
           }
             res.render('distributeur',{
               resultats: rest
             })
         }
   })
  }else{
    res.render("index");
  }
  
});
app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));
//listen for request on port 3000, and as a callback function have the port listened on logged
app.listen(5000,() => {
  console.log(`Server started on port 5000`);
});