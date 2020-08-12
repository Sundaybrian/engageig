const { admin } = require("../utils/admin");
const config = require("../utils/config");

// upload product image
exports.uploadImage = (req, res) => {
  const Busboy = require("busboy");
  const path = require("path");
  const os = require(os);
  const fs = require(fs);
  const mongoose = require("mongoose");

  const busboy = new Busboy({ headers: req.headers });
  let imageFileName;
  let imageUploaded = {};

  busboy.on("file", (fieldname, file, filename, enconding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "wrong file type" });
    }

    const imageExtension = filename.split(".")[filename.split(".").length - 1]; // grab image extesion
    imageFileName = `${mongoose.Types.ObjectId()}.${imageExtension}`; // create a name
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", () => {
    // upload image
    admin
      .storage()
      .bucket()
      .upload(imageUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageUploaded.mimetype,
          },
        },
      })
      .then(() => {
        // save the image to the user doc
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;

        // save to mongodb from here,by calling product endpoint
      })
      .then(() => {
        res.json({ message: "Image uploaded succesfully" });
      })
      .catch((err) => res.json({ err }));
  });

  busboy.end(req.rawBody);
};
