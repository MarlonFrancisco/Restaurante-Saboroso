let mysql = require("mysql2");

let conn = mysql.createConnection({
	host: "localhost",
	user: "root",
	database: "saboroso",
	password: "",
	multipleStatements: true
});

module.exports = conn;