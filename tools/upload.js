'use strict';

const multer = require('multer');

const storage = multer.diskStorage({
  destination : function (req, file, cb) {
    cb(null, config.static.uploadDir);
  },
  filename: function (req, file, cb) {
    let extname = file.originalname.split('.').pop();
    let filename = Date.now() + '.' + extname;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage
});

module.exports = upload;