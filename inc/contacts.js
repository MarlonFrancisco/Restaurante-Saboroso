let conn = require("./db");

module.exports = {
    getContacts: () => {
        return new Promise((resolve, reject) => {
            conn.query(`
                SELECT * FROM tb_contacts ORDER BY id
            `, (err, results, fields) => {
                if(err) reject(err);
                else resolve(results);
            })
        })
    },

    deleteContact: (fields) => {
        console.log(fields.id);
        return new Promise((resolve, reject) => {
            conn.query(`
                DELETE FROM tb_contacts WHERE id = ?
            `, [fields.id], (err, results, fields) => {
                if(err) reject(err);
                else resolve(results);
            })
        })
    }
}