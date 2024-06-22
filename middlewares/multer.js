const multer = require('multer');

let uploadImage = (folder) => {
  const storage = multer.diskStorage({
    destination: `public/images/${folder}`,
    filename: (req, file, cb)=> {
      let originalName = Date.now() + " - " + file.originalname;
      cb(null, originalName)
    }
  })

  const upload = multer({storage: storage}).single("img");
  return upload;
}

module.exports = uploadImage;