let conn = require("./db");
let Pagination = require("./Pagination");
let moment = require("moment");

module.exports = {
	save: (fields) => {

		return new Promise((resolve, reject) => {

			let query, data = [fields.name, fields.email, fields.people, fields.date, fields.time];

			if(fields.id && parseInt(fields.id) > 0) {
				query = `
					UPDATE tb_reservations SET name = ?, email = ?, people = ?, date = ?, time = ? 
					WHERE id = ?
				`;

				data.push(fields.id);
			} else {
				query = `
					INSERT INTO tb_reservations (name, email, people, date, time) VALUES (?, ?, ?, ?, ?)
				`;
			}

			conn.query(query, data, (err, results, fields) => {
				if(err) reject(err);
				else resolve(results);
			})
		})
	},

	read: (req) => {

		return new Promise((resolve, reject) => {

			let page = req.query.page,
			start = req.query.start,
			end = req.query.end;

			if(!page) page = 1;

			let params = [];
			if(start && end) params.push(start, end);
	
			let pagination = new Pagination(
				`
					SELECT SQL_CALC_FOUND_ROWS * FROM tb_reservations 
					${(start && end) ? 'WHERE date BETWEEN ? AND ?' : ''} 
					ORDER BY id LIMIT ?, ?
				`,
				params,
				10
			);
			
			pagination.getPage(page).then(data => {
				resolve({
					data,
					links: pagination.getNavigation({start, end})
				});
			}).catch(err =>{
				reject(err);
			});
		})
	},

	del: (id) => {
		return new Promise((resolve, reject) => {
			conn.query(`
				DELETE FROM tb_reservations WHERE id = ?
			`, [id], (err, results, fields) => {
				if(err) reject(err);
				else resolve(err);
			})
		})
	},

	chart: (req) => {
		return new Promise((resolve, reject) => {

			let start = req.query.start,
			end = req.query.end;

			conn.query(`
				SELECT CONCAT(YEAR(date), '-', MONTH(date)) as date, COUNT(*) AS total, SUM(people) / COUNT(*) AS 
				avg_people FROM tb_reservations ${(start && end) ? 'WHERE date BETWEEN ? AND ?' : ''} GROUP BY YEAR(date) DESC, 
				MONTH(date) DESC ORDER BY YEAR(date) DESC, MONTH(date) DESC
			`, [start, end], (err, results, fields) => {
				if(err) {
					reject(err);
				} else {

					let month = [];
					let values = [];

					results.forEach(row => {
						month.push(moment(row.date).format("MMM YYYY"));
						values.push(row.total);
					});

					resolve({
						month,
						values
					})
				}
			})
		})
	}
}