const express = require('express');
const session = require('express-session');
const app = express();
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');

// Folder public untuk static import
app.use(express.static(path.join(__dirname, '/public')));

// View engine dengan ejs
app.set('view engine','ejs');

// Session Login
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
var sess;

// BodyParser
app.use(bodyParser.json());
urlencoded = bodyParser.urlencoded({ extended: false });
app.use(urlencoded);

// PostgreSQL Database Connection
const db = knex({
	client: 'pg',
	connection: {
		host : 'localhost',
		user : 'philip',
		password : 'master',
		database : 'jobseeker'
	}
});

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

router.get('/register',(req,res)=>{
	sess = req.session;
	res.render('register',{sess:sess,status:'ok'});
});

router.get('/login',(req,res)=>{
	sess = req.session;
	res.render('login',{sess:sess,status:'ok'});
});

router.get('/profile',(req,res)=>{
	sess = req.session;
	res.render('profile',{sess:sess});
});

router.get('/joblist',(req,res)=>{
	sess = req.session;
	res.render('joblist',{sess:sess});
});

router.get('/register-employer',(req,res)=>{
	sess = req.session;
	res.render('register-employer',{sess:sess,status:'ok'});
});

router.get('/register-company',(req,res)=>{
	sess = req.session;
	res.render('register-company',{sess:sess});
});

// POST request
router.post('/register-employer',urlencoded,function(req,res){
	sess = req.session;
	const {username,email,password} = req.body;
	db('users').returning('*').insert({
		username : username,
		email : email,
		joined : new Date()
	}).then(user =>{
		sess.user = user[0];
		sess.email = user[0].email;
		res.redirect(`profile`);
	}).catch(error => {
		res.status(400).render('register-employer',{sess:sess,status:'no'})
	})
});

router.post('/login',urlencoded,function(req,res){
	sess = req.session;
	get_user(req.body.email,false).then( user =>{
		sess.user = user[0];
		sess.email = user[0].email;
		res.redirect(`profile`);
	}).catch(error => {
		res.render('login',{sess:sess,status:'no'});
	})
});

// Running Server
const port = 8000;
app.use('/',router);
app.listen(port);
console.log(`Website Successfully Deployed! Go to : http//localhost:${port}`);