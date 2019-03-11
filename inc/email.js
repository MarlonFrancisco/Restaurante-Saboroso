let conn = require("./db");

module.exports = {
    getEmails: () => {
        return new Promise((resolve, reject) => {
            conn.query(`
                SELECT * FROM tb_emails ORDER BY id
            `, (err, results, fields) => {
                if(err) reject(err);
                else resolve(results);
            })
        })
    },

    setEmail: (fields) => {
        return new Promise((resolve, reject) => {
            conn.query(`
                INSERT INTO tb_emails (email) VALUES (?)
            `, [fields.email], (err, results, fields) => {
                if(err) reject(err);
                else resolve(results);
            })
        })
    },

    deleteEmail: (fields) => {
        return new Promise((resolve, reject) => {
            conn.query(`
                DELETE FROM tb_emails WHERE id = ?
            `, [fields.id], (err, results, fields) => {
                if(err) reject(err);
                else resolve(results);
            })
        })
    }
}