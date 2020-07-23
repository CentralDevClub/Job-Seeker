const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');

app.get('/',function(req,res){
	res.render('home');
});

app.get('/categories',function(req,res){
	res.render('categories');
});

const port = 8000;
app.listen(port);
console.log(`Website Successfully Deployed! Go to : http//localhost:${port}`);