const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');

// PostgreSQL Database
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

// Folder public untuk static import
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine','ejs');

// BodyParser
app.use(bodyParser.json());
urlencoded = bodyParser.urlencoded({ extended: false });
app.use(urlencoded);

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
app.get('/',(req,res)=>{
	res.render('landing');
});

app.get('/categories',function(req,res){
	res.render('categories');
});

app.get('/register',(req,res)=>{
	res.render('register',{status:'ok'});
});

<<<<<<< HEAD
=======
app.get('/register-employer',(req,res)=>{
	res.render('register-employer');
});

app.get('/register-company',(req,res)=>{
	res.render('register-company');
});

>>>>>>> Register All Pages - moved to NodeJS environment
app.get('/login',(req,res)=>{
	res.render('login',{status:'ok'});
});

app.get('/profile/:username',(req,res)=>{
	get_user(req.params.username).then( user =>{
		res.render('profile',{data:user[0]});
	});
});

// POST request
app.post('/register',urlencoded,function(req,res){
	const {username,email,password} = req.body;
	db('users').returning('*').insert({
		username : username,
		email : email,
		joined : new Date()
	}).then(user =>{
		res.redirect(`profile/${user[0].username}`)
	}).catch(error => {
		res.status(400).json(error)
	})
});

app.post('/login',urlencoded,function(req,res){
	get_user(req.body.email,false).then( user =>{
		res.redirect(`profile/${user[0].username}`);
	}).catch(error => {
		res.render('login',{status:'no'});
	})
});

// Running Server
const port = 8000;
app.listen(port);
console.log(`Website Successfully Deployed! Go to : http//localhost:${port}`);