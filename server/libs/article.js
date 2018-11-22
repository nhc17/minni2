const express = require('express'),
      bp = require('body-parser'),
      admin = require('firebase-admin');
      
      

var db = admin.firestore();

var categoriesCollection = db.collection('categories');
var articlesCollection = db.collection('articles');
var authorsCollection = db.collection('authors');

module.exports = function() {

    const router = express.Router();

    /////////////////////////////////////////////////// READ /////////////////////////////////////////////////////
    // GET an array of articles
    router.get('/articles', (req, res) => {
        articlesCollection
        .get()
        .then(snapshot => {
            let articlesArr = [];
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                var returnResult = {
                    id: doc.id,
                    result: doc.data()
                }
                articlesArr.push(returnResult);       
        });
        res.status(200).json(articlesArr);
    })
    .catch(err => {
        console.log('Error getting documents', err);
        res.status(500).json(err);
        }); 
    });
      
    
    
    // GET array of articles by a category     ->   /categories/dPjT5HAmjX4NUa7RNwWc
    router.get('/categories/:id', (req, res) => {
        let categoryId = req.params.id;
        console.log(categoryId);
        if (typeof(categoryId === 'undefined')){
            if (categoryId === '') {
                console.log('category is undefined');
                res.status(500).json({error: "category is undefined"});
            }
        }
        categoriesCollection
            .doc(categoryId)
            .get()
            .then(articlesCollection
                .where('category_id', '==', categoryId)
                .get()
                .then((result) => {
                    let articleData = []
                
                    articleData = result.docs.map(value => {
                        return value.data();
                    });
    
                    res.status(200).json(articleData)
                })                
                .catch(err => {
                    console.log('Error getting documents', err);
                })
              )
            });

    // GET an array of articles by an author  ->  /author/CXanTuiKNdVYCPlIOkEr
    router.get('/authors/:id', (req, res) => {
        let authorId = req.params.id;
        console.log(authorId);
        if (typeof(authorId === 'undefined')){
            if (authorId === '') {
                console.log('author is undefined');
                res.status(500).json({error: "author is undefined"});
            }
        }
        authorsCollection
            .doc(authorId)
            .get()
            .then(articlesCollection
                .where('author_id', '==', authorId)
                .get()
                .then((result) => {
                    let articleData = []
                
                    articleData = result.docs.map(value => {
                        return value.data();
                    });
    
                    res.status(200).json(articleData)
                })                
                .catch(err => {
                    console.log('Error getting documents', err);
                })
            )
        });
    

    // GET one article by id  ->   /article/A4286YJgTaSIkfxAl7O3
    router.get('/articles/:id', (req, res) => {
        let idValue = req.params.id;
       
        if (typeof(idValue === 'undefined')){
            if (idValue === '' ){
                console.log('article is undefined');
                res.status(500).json({error: "article is undefined"});
            }
        }
        articlesCollection
        .doc(idValue)
        .get()
        .then((result) => {
            console.log(result.data());
            var returnResult = {
                id: idValue,
                category_id: result.data().category_id,
                category_name: result.data().category_name,
                title : result.data().title,
                tags : result.data().tags,
                author_id: result.data().author_id,
                author_firstname: result.data().author_firstname,
                author_lastname: result.data().author_lastname,
                author_thumbnail_url: result.data().author_thumbnail_url,
                post_date: result.data().post_date,
                duration: result.data().duration,
                thumbnail_url: result.data().thumbnail_url,
                summary: result.data().summary,
                content: result.data().content,
                image_url: result.data().image_url,
            }
            res.status(200).json(returnResult)
        })
        .catch(err => {
            console.log('Error getting documents', err);
            res.status(500).json(err);
        })
    });

    /////////////////////////////////////////////////// CREATE /////////////////////////////////////////////////////
    // Add one article 
    router.post('/articles', bp.urlencoded({ extended: true}), bp.json({ limit: "50MB" }), (req, res) => {
        let article = {... req.body };
        console.log(".....articles" + JSON.stringify(article));
        articlesCollection
            .add(article)
            .then(result => res.status(200).json("Article added"))
            .catch(error => res.status(500).json(error));
        })

    /////////////////////////////////////////////////// UPDATE /////////////////////////////////////////////////////
    // Edit article
    router.put('/articles', bp.urlencoded({ extended: true }), bp.json({ limit: "50MB" }), (req, res) => {
        console.log(JSON.stringify(req.body));
        let article = {... req.body};
        let idValue = article.id;        
        console.log(idValue);       
        articlesCollection.doc(idValue).update(
            article,
            { merge: true });
            console.log(article)
        res.status(200).json(article);
    });

    /////////////////////////////////////////////////// DELETE /////////////////////////////////////////////////////
    router.delete('/articles', (req, res) => {
        let idValue = req.query.id;
        articlesCollection.doc(idValue).delete().then((result) => {
            res.status(200).json(result);
        }).catch((error) => {
            res.status(500).json(error);
        });
    });

    return(router);

}