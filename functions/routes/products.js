const { admin } = require("../utils/admin");
const config = require("../utils/config");

// upload product image
exports.uploadImage = async (req, res) => {
  const Busboy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  const mongoose = require("mongoose");

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
    imageUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));

    // add images to the array
    imagesToUpload.push(imageUploaded)
  });

  busboy.on("finish", () => {
      let promises = [];
      let imageUrls = [];

      // loop to imagesToUpload
      imagesToUpload.forEach(img => {
          // push images to the array
        //   /o${folderwillbeuserid}%2F${imageFileName}
        imageUrls.push({url:`https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`})

        // create an array of promises
        promises.push(
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
              }))

      })

      try {
          await Promises.all(promises);
          res.status(200).json({ message: "Image uploaded succesfully" });
      } catch (error) {
          res.status(500).json({error})
      }


    // upload image
//     admin
//       .storage()
//       .bucket()
//       .upload(imageUploaded.filepath, {
//         resumable: false,
//         metadata: {
//           metadata: {
//             contentType: imageUploaded.mimetype,
//           },
//         },
//       })
//       .then(() => {
//         // save the image to the user doc
//         const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;

//         // save to mongodb from here,by calling product endpoint
//       })
//       .then(() => {
//         res.json({ message: "Image uploaded succesfully" });
//       })
//       .catch((err) => res.json({ err }));
//   });
});
  busboy.end(req.rawBody);
};
