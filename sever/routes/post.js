import express from "express";
import connection from "../config/db.js";
import { authMiddleware } from "../../middlewares/middleware.js";
const route = express.Router();

// function To Send & Excute All Queries
var dbQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            if (err) return reject(err);
            resolve(Object.values(JSON.parse(JSON.stringify(result))));
        })
    });

};


// get All Posts
route.get("/", async (req, res) => {
    const local = {
        title: "Express Blogs",
        description: "simple Blog create with:Node js,xamp,Express "
    };
    let pageSize = 3;

    let currentPage = req.query.page || 1;

    //filter -search text-
    let searchText = req.query.search;
    // searchText=searchText.replace(/[^a-zA-Z]/g,"");

    //add -search query- to main query
    let searchRequest = (searchText == undefined) ? "" : `where title like '%${searchText.replace(/[^a-zA-Z]/g, "")}%'`;

    //add -search="-stringValue-"- to pagination if there are more than -pageSize-
    let searchResponse = (searchText == undefined) ? "" : `search=${searchText.replace(/[^a-zA-Z]/g, "")}&`;

    let query = `SELECT COUNT(ID) AS total FROM post ${searchRequest}`;
    let result = await dbQuery(query, null);
    let totalItems = result[0].total;
    let OFFSET = (currentPage - 1) * pageSize;
    query = `SELECT * FROM post ${searchRequest}
            ORDER BY ID
            LIMIT ${pageSize}
            OFFSET ${OFFSET}`;

    let totalPages = Math.ceil(totalItems / pageSize);
    var data = await dbQuery(query, null);

    res.render('home', { local, data, totalPages, currentPage, search: searchResponse });

});

const getPostByID = async (ID) => {
    let query = `SELECT * FROM post WHERE ID =?`;
    let data = await dbQuery(query, [ID]);
    return data;
}


//Use this Function When create new post
const getDay = () => {
    let currentDate = new Date();
    return (
        `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`
    );
}
// show post by ID
route.get("/post/:id", async (req, res) => {
    const local = {
        title: "Express Blogs",
        description: "simple Blog create with:Node js,xamp,Express "
    };
    let postID = req.params.id;
    let data = await getPostByID(postID);
    res.render('showPost', { local, post: data });

});

// -Add New Post- & -Edit Post- Template
route.get("/update/:operation", authMiddleware, async (req, res) => {
    //operation can be :
    //**string 'new' : it means add new post
    //**or number 'ID' : it means update that post with this ID
    const local = {
        title: "Express Blogs",
        description: "simple Blog create with:Node js,xamp,Express "
    };
    let operation = req.params.operation;
    let resOperation = {
        title: (operation == "new") ? "new" : "edit",
        nextUrlOperation: (operation == "new") ? "/update/new" : `/update/${operation}`,
        data: (operation == "new") ? null : await getPostByID(operation),
    };
    res.render('edit', { local, resOperation });

});

// Send New Post request
route.post("/update/new", authMiddleware, async (req, res) => {

    let title = req.body.title;
    let body = req.body.body;
    let createdAt = getDay();
    let query = `INSERT INTO post(title, body, createdAt, updatedAt) VALUES (?,?,?,?)`;
    await dbQuery(query, [title, body, createdAt, createdAt]);

    res.redirect(`/update/new`);
});

// Send Edit Post request
route.post("/update/:id", authMiddleware, async (req, res) => {

    let postID = req.params.id;
    let title = req.body.title;
    let body = req.body.body;
    let updatedAt = getDay();
    let query = "UPDATE `post` SET `title`=?,`body`=?,`updatedAt`=? WHERE ID=?";
    await dbQuery(query, [title, body, updatedAt, postID]);
    res.redirect(`/update/${postID}`);

});

// Send delete Post request
route.post("/delete/:id",authMiddleware, async (req, res) => {

    let postID = req.params.id;
    let query = "DELETE FROM  post where ID = ?";
    await dbQuery(query, [postID]);
    res.redirect(`/`);

});

export default route;