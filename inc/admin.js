let conn = require("./db");
let fs = require("fs");

module.exports = {
	login: (data) => {
		return new Promise((resolve, reject) => {
			conn.query(
				`SELECT * FROM tb_users WHERE email = '${data.email}' AND password = '${data.password}'`
			, (err, results, fields) => {
				if(err) reject(err);

				if(results.length > 0) resolve(results[0]);
				else reject(false);
			})
		})
	},

	log: (texto) => {
		return new Promise((resolve, reject) => {
			fs.appendFile('logAdmin.json', texto, (err) => {

				if(err) reject(err);
				else resolve(true);

			})
		})
	},

	page: (data) => {
		return {
			title: "Pagina Administrativa",
			data: data.session.user,
			url: data.url
		}
	},

	index: () => {
		return new Promise((resolve, reject) => {
			conn.query(`
				SELECT (SELECT COUNT(*) FROM tb_contacts) as contacts,
						(SELECT COUNT(*) FROM tb_users) as users,
						(SELECT COUNT(*) FROM tb_menus) as menus,
						(SELECT COUNT(*) FROM tb_reservations) as reservations
			`, (err, results, fields) => {
				if(err) reject(err);

				if(results.length > 0) resolve({
					contacts: {
						link: "contacts",
						color: "red",
						icon: "ion ion-ios-chatboxes",
						name: "Contatos",
						data: results[0].contacts
					},
					users: {
						link: "users",
						color: "yellow",
						icon: "ion ion-ios-people-outline",
						name: "Usuarios",
						data: results[0].users
					},
					menus: {
						link: "menus",
						color: "green",
						icon: "fa fa-cutlery",
						name: "Menus",
						data: results[0].menus
					},
					reservations: {
						link: "reservations",
						color: "aqua",
						icon: "ion ion-ios-calendar",
						name: "Reservas",
						data: results[0].reservations
					}
				});
				else resolve({
					contacts: {},
					users: {},
					menus: {},
					reservations: {}
				})
			})
		})
	},

	getUsers: () => {
		return new Promise((resolve, reject) => {
			conn.query(`
				SELECT * FROM tb_users ORDER BY id
			`, (err, results, fields) => {
				if(err) reject(err);
				else resolve(results);
			})
		})
	},
	
	setUser: (fields, id = null) => {
		return new Promise((resolve, reject) => {
			
			let query, data;

			if(parseInt(fields.id) > 0 && id == null) {
				query = `
					UPDATE tb_users SET name = ?, email = ? WHERE id = ?
				`;

				data = [fields.name, fields.email, fields.id];
			} else if(parseInt(fields.id) > 0 && id != null) {
				query = `
					UPDATE tb_users SET password = ? WHERE id = ? 
				`;

				data = [fields.password, fields.id];
			} else {
				query = `
					INSERT INTO tb_users (name, email, password) VALUES (?, ?, ?)
				`;

				data = [fields.name, fields.email, fields.password];
			}

			conn.query(query, data, (err, results, fields) => {
				if(err) reject(err);
				else resolve(results);
			})
		})
	},

	setPassword: (fields) => {
		return new Promise((resolve, reject) => {
			conn.query(`
				UPDATE tb_users SET password = ? WHERE id = ?
			`, [fields.password, fields.id], (err, results, fields) => {
				if(err) reject(err);
				else resolve(results);
			})
		})
	},

	deleteUser: (fields) => {
		return new Promise((resolve, reject) => {
			conn.query(`
				DELETE FROM tb_users WHERE id = ?
			`, [fields.id], (err, results, fields) => {
				if(err) reject(err);
				else resolve(results)
			})
		})
	}
}