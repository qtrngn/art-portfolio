import mysql from "mysql2"; 

const db = mysql.createConnection ({
    host: "localhost",
    user: "root", 
    password: "root",
    database: "arts",
    port: 8889
});

db.connect((err) => {
    if (err) {
        console.log("Error connecting to arts database",{
            code: err.code,
            message: err.message,
            stack: err.stack,
        });
        return;
    }

    console.log("Connected to arts database");
}); 

export default db;
