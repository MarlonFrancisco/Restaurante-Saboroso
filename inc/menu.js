let conn = require('./db');
let path = require("path");

module.exports = {
	read: () => {
		return new Promise((resolve, reject) => {
			conn.query(`
				SELECT * FROM tb_menus ORDER BY id
			`, (err, results, fields) => {
				if(err) reject(err);

				resolve(results);
			})
		})
	},

	save: (fields, files) => {
		return new Promise((resolve, reject) => {

			fields.photo = `images/${path.parse(files.photo.path).base}`;

			conn.query(`
				INSERT INTO tb_menus (title, description, price, photo) 
				VALUES(?, ?, ?, ?)
			`, [
				fields.title,
				fields.description,
				fields.price,
				fields.photo
			], (err, results, fields) => {
				if(err) reject(err);
				else resolve(results);
			})

		})
	},

	update: (fields, files) => {
		return new Promise((resolve, reject) => {
			fields.photo = `images/${path.parse(files.photo.path).base}`;

			conn.query(`
				UPDATE 	tb_menus SET title = ?, description = ?, price = ?, photo = ? 
				WHERE id = ?
			`, [
				fields.title,
				fields.description,
				fields.price,
				fields.photo,
				fields.id
			], (err, results, fields) => {
				if(err) reject(err);
				else resolve(results);
			})
		})
	},

	delete: (fields) => {
		return new Promise((resolve, reject) => {
			conn.query(`
				DELETE FROM tb_menus WHERE id = ?
			`, [fields.id], (err, results, fields) => {
				if(err) reject(err);
				else resolve(results);
			})
		})
	},

	selectCardapio: (menu) => {
		let cardapio = [];
		let verify = [];

		for(let c = 0; cardapio.length <= 2; c++) {

			let select = Math.floor(Math.random() * (menu.length-1));

			if(verify.indexOf(select) == -1) {
				cardapio.push(menu[select]);
				verify.push(select);
			}

		}

		return cardapio;
	}
}