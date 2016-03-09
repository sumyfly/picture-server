var express = require('express');
var router = express.Router();
var formidable = require('formidable');

var fs = require('fs'),
    TITLE = 'formidable上传',
    AVATAR_UPLOAD_FOLDER = '/adv';
  
router.get('/', function (req, res) {
  res.render('upload', { title: TITLE });
});

//上传功能
router.post('/', function (req, res) {
  var form = new formidable.IncomingForm();   //创建上传表单
  form.encoding = 'utf-8';		//设置编辑
  var date = new Date();
  var dir = './public' + AVATAR_UPLOAD_FOLDER + '/' + date.Format('yyyy-MM-dd') + '/';	 //设置上传目录
  var folder_exists = fs.existsSync(dir);
  if (folder_exists == false)
    fs.mkdir(dir);
  form.uploadDir = dir;	 //设置上传目录
  form.keepExtensions = true;	 //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

  form.parse(req, function (err, fields, files) {

    if (err) {
      res.locals.error = err;
      res.render('upload', { title: TITLE });
      return;
    }

    var extName = '';  //后缀名
    switch (files.file.type) {
      case 'image/pjpeg':
        extName = 'jpg';
        break;
      case 'image/jpeg':
        extName = 'jpg';
        break;
      case 'image/png':
        extName = 'png';
        break;
      case 'image/x-png':
        extName = 'png';
        break;
    }

    if (extName.length == 0) {
      res.locals.error = '只支持png和jpg格式图片';
      res.render('index', { title: TITLE });
      return;
    }

    var avatarName = 'upload' + Math.random() + '.' + extName;
    var newPath = form.uploadDir + avatarName;

    console.log(newPath);
    fs.renameSync(files.file.path, newPath);  //重命名
  });

  res.locals.success = '上传成功';
  res.render('index', { title: TITLE });
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

// delete the folder 
var deleteFolderRecursive = function (path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    // delete the files
    files.forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlink(curPath);
      }
    });
    // delete the folder
    fs.rmdirSync(path);
  }
};

// delete specified picture folder
router.get('/delete/:date', function (req, res, next) {
  var dir = './public' + AVATAR_UPLOAD_FOLDER + '/' + req.params.date + '/';
  deleteFolderRecursive(dir);
  res.redirect('/upload/manager')
});

// show the picture in the folder
router.get('/getpicture/:date', function (req, res, next) {
  var dir = './public' + AVATAR_UPLOAD_FOLDER + '/' + req.params.date + '/';
  var files = scanFolder(dir).files;
  res.render('picture',{images:files});
});

// manager the picture folder
router.get('/manager', function (req, res, next) {
    var dir = './public' + AVATAR_UPLOAD_FOLDER + '/';
    var folders = scanFolder(dir).folders;
    res.render('manager',{folders:folders, title:'管理图片'});
})

//scan file & folde
function scanFolder(path) {
  var fileList = [],
    folderList = [],
    walk = function (path, fileList, folderList) {
      var files = fs.readdirSync(path);
      files.forEach(function (item) {
        var tmpPath = path + '/' + item,
          stats = fs.statSync(tmpPath);

        if (stats.isDirectory()) {
          walk(tmpPath, fileList, folderList);
          folderList.push(tmpPath);
        } else {
          fileList.push(tmpPath);
        }
      });
    };

  walk(path, fileList, folderList);

  console.log('扫描' + path + '成功');

  return {
    'files': fileList,
    'folders': folderList
  }
}


module.exports = router;