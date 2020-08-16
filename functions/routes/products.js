const { admin } = require("../utils/admin");
const config = require("../utils/mongo");

// upload product image
exports.uploadImage = (req, res) => {
  const Busboy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  const mongoose = require("mongoose");
  const folder = req.user.uid;

  const busboy = new Busboy({ headers: req.headers });
  let imageFileName;
  let imageUploaded = {};
  let imagesToUpload = [];

  busboy.on("file", (fieldname, file, filename, enconding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "wrong file type" });
    }

    const imageExtension = filename.split(".")[filename.split(".").length - 1]; // grab image extesion
    imageFileName = `${mongoose.Types.ObjectId()}.${imageExtension}`; // create a name
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageUploaded = { imageFileName, filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));

    // add images to the array
    imagesToUpload.push(imageUploaded);
  });

  busboy.on("finish", async () => {
    let promises = [];
    let imageUrls = [];

    // loop to imagesToUpload
    imagesToUpload.forEach((img) => {
      // push images to the array

      imageUrls.push({
        url: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o${folder}%2F${img.imageFileName}?alt=media`,
      });

      // create an array of promises
      promises.push(
        admin
          .storage()
          .bucket()
          .upload(img.filepath, {
            destination: `${folder}/${img.imageFileName}`,
            resumable: false,
            metadata: {
              metadata: {
                contentType: imageUploaded.mimetype,
              },
            },
          })
      );
    });

    try {
      await Promise.all(promises);
      res
        .status(200)
        .json({ message: "Image uploaded succesfully", images: imageUrls });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  });
  busboy.end(req.rawBody);
};
