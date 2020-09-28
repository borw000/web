const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).render('login', {
                message: '請完整輸入'
            })
        }

        db.query('SELECT * FROM user WHERE name = ?', [name], async (error, results) => {
            console.log(results);
            //下面少了await
            if (!results || ! (  bcrypt.compare(req.body.password, results[0].password))) {
                
                res.status(401).render('login', {
                    message: '帳號或密碼不正確'
                })
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("token:" + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
                    ),
                    httpOnly: true

                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/buy2');


            }


        })

    } catch (error) {
        console.log(error);
    }
}


exports.register = (req, res) => {
    console.log(req.body);


    const { email, name, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM user WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: '此信箱已被註冊'
            });
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: '兩次密碼輸入不一致'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);


        db.query('INSERT INTO user SET ?', { name: name, email: email, password: password }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: '成功登入'
                });
            }
        });


    });






}