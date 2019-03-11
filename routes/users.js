var express = require('express');
var router = express.Router();
var user = require('./../inc/user');

router.post('/reserva', (req, res, next) => {
	let format = req.body.date.split('/');
	format = `${format[2]}-${format[1]}-${format[0]}`;

	req.body.date = format;
	user.reserva(req.body).then(resultado => {
		user.log(1, JSON.stringify(resultado), 'reservation', res);

	}).catch(error => {
		user.log(2, JSON.stringify(error), 'reservation', res);
	})
});

router.post("/contact", (req, res, next) => {
	user.contato(req.body).then(resultado => {
		user.log(1, JSON.stringify(resultado), 'contact', res);
	}).catch(error => {
		user.log(2, JSON.stringify(error), 'contact', res);
	})
});

module.exports = router;
