var express = require('express');
var router = express.Router();
var session = require('express-session');
var guid = require('../public/js/util/guid');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/home/');
});

//homepage
router.get('/home', function (req, res, next) {
    if (req.session.user == null) {
        res.redirect('/login');
    }
    else {
        res.render('home', { title: '首页' });
    }
});


router.get('/guid', function (req, res, next) {
    res.send('guid is ' + guid().create());
});


router.get('/login', function (req, res, next) {
    res.render('login', { title: '用户登录' });
});

router.post('/login', function (req, res, next) {
    var user = {
        username: 'admin',
        password: 'admin'
    }
    if (req.body.username === user.username && req.body.password === user.password) {
        //save session
        req.session.user = req.body.username;
        res.redirect('/home');
    } else
        res.redirect('/login');
});

router.get('/logout', function (req, res, next) {
    req.session.user = null;
    res.redirect('/');
});

router.get('/dropzone', function (req, res, next) {
    var date = new Date();
    date = date.Format("yyyy-MM-dd");
    res.render('dropzone', { title: '上传图片' , date: date});
});

router.get('/about', function (req, res, next) {
    res.render('about', { title: '关于' });
});

Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
module.exports = router;
