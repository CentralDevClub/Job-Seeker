const express = require('express');
const session = require('cookie-session');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');
const bcrypt = require('bcrypt')

const app = express();
const router = express.Router();
const saltRounds = 10;

// BodyParser
app.use(bodyParser.json());
urlencoded = bodyParser.urlencoded({ extended: false });
app.use(urlencoded);

// Folder public untuk static import
app.use(express.static(path.join(__dirname, '/public')));

// View engine dengan ejs
app.set('view engine','ejs');

// Setting proxy
app.set('trust proxy', 1);

// Session Login (Global session)
app.use(
	session({
		cookie: {
			secure:true,
			maxAge:60000
		},
		secret: 'secret',
		saveUninitialized: true,
		resave: false
	})
);

var sess;

// PostgreSQL Database Connection
const db_setting = require("./setting.json");
const db = knex(db_setting);

// Show all database
function display_database(){
	db.select('*').from('users').then(data => {
		console.log(data);
	});
};

// Get username sql database function
function get_user(data,username=true){
	if (username){
		let user = db('users').where({
			username:data,
		}).select('*');
		return user
	} else{
		let user = db('users').where({
			email:data,
		}).select('*')
		return user
	};
};

// Routing
router.get('/',(req,res)=>{
	sess = req.session;
    res.render('landing',{sess:sess});
});

router.get('/categories',function(req,res){
	sess = req.session;
	res.render('categories',{sess:sess});
});

router.get('/profile',(req,res)=>{
	sess = req.session;
	res.render('profile',{sess:sess});
});

router.get('/register',(req,res)=>{
	sess = req.session;
	res.render('register',{sess:sess,status:'ok'});
});

router.get('/login',(req,res)=>{
	sess = req.session;
	res.render('login',{sess:sess,status:'ok'});
});

router.get('/login/employer',(req,res)=>{
	sess = req.session;
	res.render('login-employer',{sess:sess,status:'ok'});
});

router.get('/login/company',(req,res)=>{
	sess = req.session;
	res.render('login-company',{sess:sess,status:'ok'});
});

router.get('/joblist',(req,res)=>{
	sess = req.session;
	db.select('*').from('jobs').then(jobs => {
		res.render('joblist',{sess:sess,jobs:jobs});
	});
});

router.get('/postjob',(req,res)=>{
	sess = req.session;
	res.render('postjob',{sess:sess,status:'none'});
});

router.get('/portfolio',(req,res)=>{
	sess = req.session;
	res.render('portfolio',{sess:sess,success:undefined});
});

router.get('/register/employer',(req,res)=>{
	sess = req.session;
	res.render('register-employer',{sess:sess,status:'ok'});
});

router.get('/register/company',(req,res)=>{
	sess = req.session;
	res.render('register-company',{sess:sess});
});

// POST request
router.post('/profile',urlencoded,(req,res)=>{
	sess = null;
	res.redirect('/');
});

// Register Employer
router.post('/register/employer',urlencoded,function(req,res){
	sess = req.session;
	const {username,email,password} = req.body;
	// Insert ke table users
	db('users').returning('*').insert({
		username : username,
		email : email,
		joined : new Date()
	}).then(user=>{
		sess.user = user[0];
		sess.email = user[0].email;
	}).catch(error => {
		// Catch error untuk register gagal
		res.status(400).render('register-employer',{sess:sess,status:'no'})
	}).then(user=>{
		// Encrypt password
		bcrypt.genSalt(saltRounds, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash) => {
				// Insert ke table login
				db('login').returning('*').insert({
					hash:hash,
					email:email
				}).then(user =>{
					// redirect ke page profile
					res.redirect(`/profile`);
				});
			});
		});
	})
});

// Post Portfolio
router.post('/portfolio',urlencoded,(req,res)=>{
	sess = req.session;
	const project = req.body;
	console.log(project);
	console.log(sess.email);
	db('portfolios').returning('*').insert({
		email:sess.email,
		project_name:project.name,
		project_desc:project.description,
		created:new Date()
	}).then(user=>{
		console.log(user);
		res.status(200).render('portfolio',{sess:sess,success:true})
	}).catch(error=>{
		console.log(error);
		res.status(400).render('portfolio',{sess:sess,success:false})
	});
});

// Post Job
router.post('/postjob',urlencoded,(req,res)=>{
	sess = req.session;
	const jobdata = req.body;
	db('jobs').returning('*').insert({
		company_email:sess.email,
		title:jobdata.title,
		category_1:jobdata.category_1,
		category_2:jobdata.category_2,
		category_3:jobdata.category_3,
		description:jobdata.description,
		qualification:jobdata.qualification,
		task:jobdata.task,
		requirement:jobdata.requirement,
		salary_type:jobdata.salary_type,
		salary_price:jobdata.salary_price,
		created: new Date()
	}).then(user => {
		res.status(200).render('postjob',{sess:sess,status:'ok'});
	}).catch(error => {
		// Catch error untuk register gagal
		res.status(400).render('postjob',{sess:sess,status:'no'});
	});
})

// Register Companies
router.post('/register/company',urlencoded,(req,res)=>{
	sess = req.session;
	const company = req.body;
	db('companies').returning('*').insert({
		name:company.name,
		email:company.email,
		description:company.description,
		goal:company.goal,
		address:company.address,
		website:company.website,
		joined: new Date()
	}).then(companylist=>{
		sess.company = true,
		sess.user = companylist[0],
		sess.email = companylist[0].email
	}).catch(error=>{
		res.status(400).render('register-company',{sess:sess,status:'no'})
	}).then(comp=>{
		bcrypt.genSalt(saltRounds,(err,salt)=>{
			bcrypt.hash(company.password,salt,(err,hash)=>{
				db('logincom').returning('*').insert({
					hash:hash,
					email:company.email
				}).then(comp=>{
					res.redirect('/profile')
				});
			});
		});
	});
});

// User Login. Employer
router.post('/login/employer',urlencoded,function(req,res){
	sess = req.session;
	// Login password validation
	db.select('*').from('login').where({email : req.body.email}).then(function (hash){
		bcrypt.compare(req.body.password,hash[0].hash,(err,data)=>{
			if (data){
				db.select('*').from('users').where({email:req.body.email}).then(user=>{
					sess.user = user[0];
					sess.email = user[0].email;
					res.redirect('/profile');
				});
			} else{
				res.render('login-employer',{sess:sess,status:'no'});
			};
		});
	}).catch(error => {
		res.render('login-employer',{sess:sess,status:'no'});
	});
});

// User Login Company
router.post('/login/company',urlencoded,(req,res)=>{
	sess = req.session;
	// Password validaion
	const company = req.body;
	db.select('*').from('logincom').where({email:company.email}).then(hash=>{
		bcrypt.compare(company.password,hash[0].hash,(err,data)=>{
			if(data){
				sess.company = true;
				db.select('*').from('companies').where({email:company.email}).then(comp=>{
					sess.user = comp[0];
					sess.email = comp[0].email;
					res.redirect('/profile');
				});
			} else{
				res.render('login-company',{sess:sess,status:'no'})
			};
		});
	}).catch(error=>{
		res.render('login-company',{sess:sess,status:'no'})
	});
});

// Running Server
app.use('/',router);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("App is running on port " + port);
});