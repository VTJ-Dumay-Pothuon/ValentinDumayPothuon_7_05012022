const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (req.route.path=='/update/:id') {
      callback(null, 'images/profiles');
    } else {
      callback(null, 'images/posts');
    }
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    callback(null, 'upld' + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');