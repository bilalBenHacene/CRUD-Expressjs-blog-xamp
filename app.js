import express from "express";
import expressLayout from "express-ejs-layouts";
import severRoute from "./sever/routes/main.js";
import postRoute from "./sever/routes/post.js";
import userRoute from "./sever/routes/user.js";
import connection from "./sever/config/db.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv" ;
dotenv.config({path:`./configs/.env`});

const app = express();
const PORT = process.env.PORT || 5000 ;

//add static files
app.use(express.static('public'));

//add middlewire
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
    secret:"anything",
    resave:false,
    saveUninitialized:true,
}))

//templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/',severRoute);
app.use('/',postRoute);
app.use('/user',userRoute);

app.listen(PORT, () => {
    console.log(`server on : http://localhost:${PORT}`);
})