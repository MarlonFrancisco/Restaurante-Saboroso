let express = require("express");
let router = express.Router();
let menuInc = require("./../inc/menu");
let email = require("./../inc/email");

router.get('/', (req, res, next) => {
	menuInc.read().then(menus => {	

		res.render("index", { 
			title: "Saboroso",
			menus: menuInc.selectCardapio(menus),
			status: req.query.cod ? req.query.cod : null
		});
	}).catch(err => {
		console.log(err);
	})
});

router.get('/contact', (req, res, next) => {
	res.render("contact", {
		title: "Saboroso",
		capa: "Diga um oi!",
		status: req.query.cod ? req.query.cod : null
	});
});

router.get("/menu", (req, res, next) => {

	menuInc.read().then(menus => {
		res.render("menu", {
			title: "Saboroso",
			capa: "Saboreie nosso menu!",
			menus,
			menus: menuInc.selectCardapio(menus)
		});
	}).catch(Err => {
		console.log(Err);
	})
});

router.get("/services", (req, res, next) => {
	res.render("services", {
		title: "Saboroso",
		capa: "É um prazer poder servir!"
	});
});

router.get("/reservation", (req, res, next) => {
	res.render("reservation", {
		title: "Saboroso",
		capa: 'Reserve uma Mesa!',
		status: req.query.cod ? req.query.cod : null
	});
});

router.post("/emails", (req, res, next) => {
	email.setEmail(req.body).then(response => {
		console.log(response);
		res.json(response);
	}).catch(err => {
		console.log(err);
		res.json(err)
	})
});


module.exports = router;