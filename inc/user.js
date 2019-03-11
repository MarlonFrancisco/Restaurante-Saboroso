let conn = require("./db");
let fs = require("fs");

module.exports = {
	reserva: (data) => {
		return new Promise((resolve, reject) => {

			conn.query(
				`INSERT INTO tb_reservations (name, email, people, date, time) VALUES
				 ('${data.name}', '${data.email}', '${data.people}', '${data.date}', '${data.time}')`
			, (err, results, fields) => {
				if(err) {
					reject(err);
				} else {
					resolve(results);
				}
			})
		});
	},

	contato: (data) => {
		return new Promise((resolve, reject) => {
			conn.query(
				`INSERT INTO tb_contacts (name, email, message) VALUES ('${data.name}', '${data.email}', '${data.message}')`
			, (err, results, fields) => {
				if(err) {
					reject(err);
				} else {
					resolve(results);
				}
			})
		})
	},

	log: (config, texto, link, res) => {
		fs.appendFile('log.json', texto, (err) => {
			if(!err) {
				res.redirect(`/${link}?cod=${config}`);
			}
		});
	} 
}