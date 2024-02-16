import express from "express";
import connection from "../config/db.js";

const route = express.Router();

// function To Send & Excute All Quries
var dbQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            if (err) return reject(err);
            resolve(Object.values(JSON.parse(JSON.stringify(result))));
        })
    });

};

// route.get("/", async (req, res) => {
//     const local = {
//         title: "login",
//         description: "simple Blog create with:Node js,xamp,Express "
//     };
//     res.render('admin/index',{local , layout:'./layouts/login'});

// });

export default route;