const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// Folder public untuk static import
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');

// BodyParser
app.use(bodyParser.json());
urlencoded = bodyParser.urlencoded({ extended: false });
app.use(urlencoded);

// Database Sementara
let database = {
	users:[{
		username:'Philip Purwoko',
		email:'philippurwoko123@gmail.com',
		password:'12345'
	},
	{
		username:'man',
		email:'man@man.com',
		password:'12345'
	}]
}

// Cek username pada database
function cekUser(username){
	let status = false;
	let i = 0;
	let index;
	database.users.forEach(user=>{
		if (user.username === username){
			status = true;
			index = i;
		};
		i++;
	});
	if (status){
		return [true,index]
	} else{
		return false
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

app.get('/profile/',(req,res)=>{
	res.render('profile',{data:req.query});
});

// POST request
app.post('/register',urlencoded,function(req,res){
	if (!cekUser(req.body.username)[0]){
		database.users.push({username:req.body.username,email:req.body.email,password:req.body.password});
		res.redirect(`profile?username=${req.body.username}&email=${req.body.email}`);
	} else {
		res.render('register',{status:'no'})
	};
	console.log(req.body);
	console.log(cekUser(req.body.username));
});

app.post('/login',urlencoded,function(req,res){
	if (cekUser(req.body.username)[0]){
		// res.render('profile',{data:database.users[cekUser(req.body.username)[1]]});
		res.redirect(`profile?username=${database.users[cekUser(req.body.username)[1]].username}&email=${database.users[cekUser(req.body.username)[1]].email}`);
	} else {
		res.render('login',{status:'no'})
	};
	console.log(database.users[cekUser(req.body.username)[1]])
	console.log(req.body);
});

// Running Server
const port = 8000;
app.listen(port);
console.log(`Website Successfully Deployed! Go to : http//localhost:${port}`);