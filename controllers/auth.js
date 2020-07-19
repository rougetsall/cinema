const mysql = require("mysql")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const  db = mysql.createConnection({
    host     : 'localhost',
    port: 8889,
    user     : 'root',
    password : 'root',
    database : 'cinema'
});
exports.login = async (req,res)=>{
    try {
        const { username,password } = req.body
         if (!username || !password) {
             return res.status(400).render('login', {
                 message: 'donne un email et une password'
             })
         }
         db.query('SELECT * FROM user WHERE username = ?',[username],async (error,results)=>{
             console.log(results)
             if ( !results || !(await bcrypt.compare(password,results[0].password))) {
                 res.status(401).render('login',{
                     message: 'usermane et passeword est incorrect'
                 })
             }else{
                 try {
                    const id = results[0].id;
                    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
                    console.log(token);
                    const cookieOption = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                        ),
                        httpOnly: true 
                    }
   
                    res.cookie('jwt',token,cookieOption );
                    res.status(200).render("home",{
                    })
                 } catch (error) {
                     console.log(error);
                 }
                }
         })
    } catch (error) {
        console.log(error)
    }

}
exports.register = (req,res) =>{
    console.log(req.body);
    const { username, name, password } = req.body;
     db.query('SELECT username FROM user WHERE username = ?',[username], async (error,results)=>{
         if (error) {
             console.log(error);
         }

        if (results.length > 0) {
            return res.render('register',{
                message: 'ce username existe deja'
            })
        }
        let hashpassword = await bcrypt.hash(password,8);
        console.log(hashpassword);

        db.query('INSERT INTO user SET ?',{username: username, name: name, password: hashpassword},(error,results)=>{
            if (error) {
             console.log(error) ;               
            }else{
                console.log(results);
                return res.render('register',{
                    message: 'user inscription reussi!!! connecter vous sur Login'
                })
            }
        })
     })
}