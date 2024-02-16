import express from "express";
import connection from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const route = express.Router();
import dotenv from "dotenv" ;
dotenv.config({path:`./configs/.env`});

const jwtSecret = process.env.JWT || "MyUnSecretBlog";

// function To Send & Excute All Quries
var dbQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            if (err) return reject(err);
            resolve(Object.values(JSON.parse(JSON.stringify(result))));
        })
    });

};

// check login middlewere
// const authMiddleware = (req, res, next) => {
//     const token = req.cookies.token;    
//     if (!token) {
//         res.redirect("/");
//     } else {
//         const decoded = jwt.verify(token, jwtSecret);
//         req.userID = decoded.userID;
//         next();
//     }
// };

// login || regiter get request
route.get("/:page", async (req, res) => {
    const local = {
        title: "user",
        description: "simple Blog create with:Node js,xamp,Express "
    };
    let page = req.params.page;
    res.render('admin/index', { local, layout: './layouts/login', pageUrl: page });

});
// register post request
route.post("/register", async (req, res) => {
    const local = {
        title: "user",
        description: "simple Blog create with:Node js,xamp,Express "
    };
    let { name, username, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    let query = `INSERT INTO user(name, email, username, password) VALUES (?,?,?,?)`;
    await dbQuery(query, [name, email, username, hashPassword]);
    
    res.redirect('/user/login');
});
// login post request
route.post("/login", async (req, res) => {
    const local = {
        title: "user",
        description: "simple Blog create with:Node js,xamp,Express "
    };
    let { username, password } = req.body;
    let query = `SELECT * FROM user WHERE username=? `;
    let user = await dbQuery(query, [username]);
    let IsValid = await bcrypt.compare(password, user[0].password);
    
    if (IsValid) {
        const token = jwt.sign({ userID: user[0].ID }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    }

    else res.redirect('/user/login');

});


export default route;