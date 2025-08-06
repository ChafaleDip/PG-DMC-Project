const mysql = require("mysql2")
const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "W2_89876_Dip",
    password: "manager",
    database: "Car_Service_db"
})

module.exports = pool
