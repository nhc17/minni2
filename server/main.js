const express = require('express'),
      admin = require('firebase-admin'),
      path = require('path'),
      cors = require('cors');

const app = express();
app.use(cors({
    origin: true,
}));

const API_URI = "/api";

/////////////////////////////////// LINKING SERVER TO FIREBASE DATABASE /////////////////////////////////////////
// Initialize Firebase

const dbInit = admin.initializeApp(require('./utils/fdb'))
admin.firestore.FieldValue.serverTimestamp();

var db = admin.firestore();

/////////////// Unscribing & Subscriing to listen for changes  /////////////////
var addCounter = 0;
var updateCounter = 0;

var articlesCollection = db.collection('articles');
console.log(articlesCollection);
var unSubscribe = subscribeArticles();

function subscribeArticles() {
    return articlesCollection.onSnapshot((snapshot) => {
        if(!snapshot.empty) {
            //console.log(snapshot);
            snapshot.docChanges().forEach((data) => {
                console.log(`==>${ Date() } ${ updateCounter }` + data.type);
                if(data.type === 'modified') {
                    updateCounter = updateCounter + 1
                }else if(data.type === 'added') {
                    addCounter = addCounter + 1;
                }
            })
        }
    });
}

app.get(API_URI + '/unsubscribe-article', (req, res) => {
    unSubscribe();
    res.status(200).json({ addCounter, updateCounter});
});

app.get(API_URI + '/subscribe-article', (req, res) => {
    unSubscribe = subscribeArticles();
    res.status(200).json({ addCounter, updateCounter });
})

//////////////// Connecting the modularized routes to main server ////////////////////
const authorCRUD = require('./libs/author'),
      categoryCRUD = require('./libs/category');
      articleCRUD = require('./libs/article'),
      fileUpload = require('./libs/gupload');

// routes
const authorRouter = authorCRUD(dbInit),
      categoryRouter = categoryCRUD(dbInit),
      articleRouter = articleCRUD(dbInit);
      fileUploadRouter = fileUpload(dbInit);

app.use(API_URI + '', authorRouter);
app.use(API_URI + '', categoryRouter);
app.use(API_URI + '', articleRouter);
app.use(API_URI + '/file', fileUploadRouter);




////////////////////////////////////////// STATIC ASSETS ////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, '/public/mini-client_angular')));


///////////////////////////////////////// START SERVER ///////////////////////////////////////////////////
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;
app.listen(PORT, () => {
    console.info(`Application started on port %d at %s`, PORT, new Date());
})