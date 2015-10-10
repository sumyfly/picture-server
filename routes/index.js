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

module.exports = router;
