// Load the mysql package
import mysql from "mysql";

// Create the connection using the server,username and password.
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
});

connection.connect(function (err) {
    if (err) console.log("XAMPP Server is not running....!");
    else {
        console.log("Connected to XAMPP Server....!");

        //sql query to create a database named  nodeJsBlog in XAMPP
        connection.query(
            "CREATE DATABASE IF NOT EXISTS nodeJsBlog",
            function (err, result) {
                //Display message in our console.
                if (err) console.log("Database nodeJsBlog not created");
                else console.log("nodeJsBlog  Database is created");
            }
        );

        connection.query("USE nodeJsBlog", function (err, result) {
            if (err) console.log("Database nodeJsBlog not used");
            else console.log("nodeJsBlog Database is used");
        });
        // create post table
        var query = `CREATE TABLE IF NOT EXISTS post (
            ID INT  NOT NULL AUTO_INCREMENT,
            title VARCHAR(255),
            body TEXT,
            createdAt DATE  ,
            updateddAt DATE  ,
            PRIMARY KEY (ID)
        )`;
        connection.query(query, function (err, result) {
            if (err) console.log(`Error : ${err.sqlMessage}`);
            else console.log("post table is created");
        });

        // create user table
        query = `CREATE TABLE IF NOT EXISTS user (
            ID INT  NOT NULL AUTO_INCREMENT,
            name VARCHAR(255),
            email VARCHAR(255),
            username VARCHAR(255),
            password VARCHAR(255),
            PRIMARY KEY (ID,username)
        )`;
        connection.query(query, function (err, result) {
            if (err) console.log(`Error : ${err.sqlMessage}`);
            else console.log("user table is created");
        });
    }
});
export default connection;
// module.exports = connection;
