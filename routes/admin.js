let express = require("express");
let router = express.Router();
let admin = require("./../inc/admin");
let menu = require("./../inc/menu");
let email = require('./../inc/email');
let reservation = require("./../inc/reservation");
let contacts = require("./../inc/contacts");
let moment = require("moment");

moment.locale("pt-BR");

router.use((req, res, next) => {
	if(['/login'].indexOf(req.url) === -1 && !req.session.user) {
		res.redirect('/admin/login');
	} else {
		next();
	}
});

router.get("/", (req, res, next) => {
	admin.index().then(resultados => {
		res.render("admin/index", Object.assign({}, admin.page(req), {
			resultados
		}))
	}).catch(err => {
		console.log(err);
	});
});

router.get("/login", (req, res, next) => {

	res.render("admin/login", {
		title: "Painel Administrativo",
		status: req.session.status ? req.session.status : null
	});
});

router.post('/login', (req, res, next) => {
	admin.login(req.body).then(resultado => {

		req.session.user = resultado;

		res.redirect('/admin');
	

	}).catch(resultado => {

		req.session.status = 1;
		res.redirect("admin/login");

	});
});

router.get("/contacts", (req, res, next) => {

	contacts.getContacts().then(contacts => {	
		res.render("admin/contacts", Object.assign({}, admin.page(req), {
			contacts
		}));
	}).catch(err => {
		console.log(err);
		res.json(err);
	})
});

router.delete("/contacts", (req, res, next) => {
	contacts.deleteContact(req.body).then(resolve => {
		console.log(resolve);
		res.json(resolve);
	}).catch(err => {
		console.log(err);
		res.json(err);
	})
})

router.get("/emails", (req, res, next) => {
	email.getEmails().then(emails => {
		res.render("admin/emails", Object.assign({}, admin.page(req), {
			emails
		}))
	}).catch(err => {
		console.log(err);
	})
});

router.delete("/emails", (req, res, next) => {
	email.deleteEmail(req.body).then(resolve => {
		console.log(resolve);
		res.json(resolve);
	}).catch(err => {
		console.log(err);
		res.json(err);
	})
})
router.get("/menus", (req, res, next) => {

	menu.read().then(menus => {
		res.render("admin/menus", Object.assign({}, admin.page(req), {
			menus
		}));
	}).catch(err => {
		console.log(err);
	})
});

router.post('/menus', (req, res, next) => {
	menu.save(req.fields, req.files).then(resolve => {
		console.log(resolve);
		res.json("success");
	}).catch(err => {
		console.log(err);
		res.json("failed");
	})
})

router.put('/menus', (req, res, next) => {
	menu.update(req.fields, req.files).then(resolve => {
		console.log(resolve);
		res.json("success");
	}).catch(reject => {
		console.log(reject);
		res.json("error");
	})
});

router.delete('/menus', (req, res, next) => {
	console.log(req.fields);
	menu.delete(req.fields).then(resolve => {
		console.log(resolve);
		res.json('success');
	}).catch(reject => {
		console.log(reject);
		res.json('error');
	})
})

router.get("/reservations", (req, res, next) => {
	reservation.read(req).then(resolve => {	
		res.render("admin/reservations", Object.assign({}, admin.page(req), {
			date: {
				start: moment(req.query.start).format("YYYY[-]MM[-]DD"), 
				end: moment(req.query.end).format("YYYY[-]MM[-]DD")
			},
			reservations: resolve.data,
			links: resolve.links,
			moment
		}));
	}).catch(err => {
		res.json(err);
		console.log(err);
	});
});

router.get("/reservations/chart", (req, res, next) => {

	reservation.chart(req).then(response => {
		res.json(response);
	}).catch(err => {
		res.json(err);
	})
})

router.post('/reservations', (req, res, next) => {
	reservation.save(req.body).then(resolve => {
		console.log(resolve);
		res.json(resolve);
	}).catch(reject => {
		console.log(reject);
		res.json(reject);
	})
});

router.put("/reservations", (req, res, next) => {
	reservation.save(req.body).then(resolve => {
		console.log(resolve);
		res.json(resolve);
	}).catch(err => {
		console.log(err);
		res.json(err);
	})
})

router.delete("/reservations", (req, res, next) => {
	console.log(req.body, req.fields);
	reservation.del(req.body.id).then(resolve => {
		console.log(resolve);
		res.json(resolve);
	}).catch(err => {
		console.log(err);
		res.json(err);
	})
})
router.get("/users", (req, res, next) => {

	admin.getUsers().then(users => {
		res.render("admin/users", Object.assign({}, admin.page(req), {
			users
		}));
	}).catch(err => {
		console.log(err);
	})
});

router.post("/users", (req, res, next) => {

	console.log(req.body);
	admin.setUser(req.body).then(resolve => {
		res.json(resolve);
	}).catch(err => {
		res.json(err);
	})
});

router.put("/users", (req, res, next) => {
	console.log(req.body);
	admin.setUser(req.body).then(resolve => {
		console.log(resolve);
		res.json(resolve);
	}).catch(err => {
		console.log(err);
		res.json(err);
	})
});

router.put("/users/updatePassword", (req, res, next) => {
	console.log(req.body);
	admin.setPassword(req.body).then(resolve => {
		console.log(resolve);
		res.json(resolve);
	}).catch(err => {
		console.log(err);
		res.json(err);
	})
})

router.delete("/users", (req, res, next) => {
	admin.deleteUser(req.body).then(resolve => {
		res.json(resolve);
	}).catch(err => {
		res.json(err);
	})
})

router.get("/logout", (req, res, next) => {
	delete req.session.user;

	res.redirect("admin/login");
});

module.exports = router;