var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/1', function(req, res, next ){
  res.send('this is 1');
});

router.get('/read/:id', function(req, res, next ){
  res.send('read id is ' + req.params.id);
});

router.get('/:action/:id', function(req, res, next ){
  res.send(req.params.action +' is ' + req.params.id);
});

router.get('/login', function(req, res, next){
  res.render('login', {title: '用户登录'});
});

router.post('/login', function(req, res, next){
  var user={
    username:'admin',
    password:'admin'
   }
  if(req.body.username===user.username && req.body.password===user.password){
  res.redirect('/home');
  }
  res.redirect('/login');
});

router.get('/logout', function(req, res, next){
  res.redirect('/');
});

module.exports = router;
