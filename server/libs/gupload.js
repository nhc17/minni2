
const express = require('express'),
      bp = require('body-parser'),
      admin = require('firebase-admin'),
      { Storage } = require('@google-cloud/storage'),
      multer = require("multer");


module.exports = function() {

    const router = express.Router();

    //export Google_Application_Credentials
    const gStorage = new Storage({
        projectId: "mini-bbb5b"
    });

    const bucket = gStorage.bucket("mini-bbb5b.appspot.com");
    const googleMulter = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024 //20MB
    }
    })

    var db = admin.firestore();

    var galleryCollection = db.collection('gallery');

    //Upload single image
    router.post('/upload', bp.urlencoded({ extended: true }), bp.json({ limit: "20MB" }),
        googleMulter.single('img'), (req, res) => {
            console.log("....uploading: ");
            if(req.file.length) {
            console.log("uploaded");
            console.log(req.file);
            uploadToFirebaseStorage(req.file).then((result) => {
                console.log(result);
                console.log(result.data);
                var galleryData = {
                    filename: result
                }
                galleryCollection
                .add(galleryData)
                .then(result => res.status(200).json(galleryData))
                .catch(error => res.status(500).json(error));
            }).catch((error) => {
                console.log(error);
                res.status(500).json(error);
            })
            } else {
                res.status(500).json({ error: "error in uploading"});
            }
        });

        const uploadToFirebaseStorage = (fileObject) => {
            return new Promise((resolve, reject) => {
                if(!fileObject) {
                    reject("Invalid file upload attempt");
                }

                let idValue = uuidv5('', uuidv5.DNS);
                console.log(idValue);

                let newFilename = `${idValue}_${fileObject.originalname}`
                console.log(newFilename);

                let firebaseFileUpload = bucket.file(newFilename);
                console.log(firebaseFileUpload);

                const blobStream = firebaseFileUpload.createWriteStream({
                    metadata: {
                        contentType: fileObject.mimeType
                    }
                });

                blobStream.on("error", (error) => {
                    console.log("error uploading" + error);
                    reject("Error uploading file!");
                });

                blobStream.on("complete", () => {
                    console.log("Uploading completed");
                    let firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/mini-bbb5b.appspot.com/o/${firebaseFileUpload.name}?alt=media&token=9d608f06-1fdc-40dc-8045-aa9a6b20b635`;
                    fileObject.fileURL = firebaseUrl;
                    resolve(firebaseUrl);
                });

                blobStream.end(fileObject.buffer);
            });
        }

    //Upload an array of images
    router.post('/upload-multiple', googleMulter.array('imgs, 3'), (req, res, next) => {
        res.status(200).json({});
    });
    
    return(router);

}
