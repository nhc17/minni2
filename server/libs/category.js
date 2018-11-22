const express = require('express'),
      bp = require('body-parser'),
      admin = require('firebase-admin'),
      router = express.Router();

var db = admin.firestore();

var categoriesCollection = db.collection('categories');

module.exports = function() {

    const router = express.Router();
    /////////////////////////////////////////////////// READ /////////////////////////////////////////////////////
    // GET array of categories
    router.get('/categories', (req, res) => {
        categoriesCollection
        .get()
        .then(snapshot => {
            let categoriesArr = [];
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                var returnResult = {
                    id: doc.id,
                    result: doc.data()
                }
                categoriesArr.push(returnResult);
            });
            res.status(200).json(categoriesArr);
        })
        .catch(err => {
            console.log('Error getting documents', err);
            res.status(500).json(err);
        });
    });

    // GET a category by name   ->    api/categories/search?category_name=Technology
    router.get('/categories/search', (req, res) => {
        let categoryName = req.query.category_name;
        console.log(categoryName);

        if (typeof(categoryName === 'undefined')){
            if (categoryName === ''){
            console.log('category name is undefined');
            res.status(500).json({error: "category name is undefined"});
            }
        }

        categoriesCollection
            .where('category_name', '==', categoryName)
            .get()
            .then((result) => {
                let categoryData = []
            
                categoryData = result.docs.map(value => {
                    return value.data();
                });

                res.status(200).json(categoryData)
            })
            .catch(err => {
                console.log('Error getting documents', err);
                res.status(500).json(err);
            })
    });

// GET a category by id  ->   api/categories/tqAnMjzk79TEZbCVWBIO
router.get('/categories/:id', (req, res) => {
    let idValue = req.params.id;
    
    categoriesCollection
        .doc(idValue)
        .get()
        .then((result) => {
            console.log(result.data());
            var returnResult = {
                id: idValue,
                category_name : result.data().category_name
            }
            res.status(200).json(returnResult)
        })
        .catch(err => {
            console.log('Error getting documents', err);
            res.status(500).json(err);
        })
});


    /////////////////////////////////////////////////// CREATE /////////////////////////////////////////////////////
    // Add one category
    router.post('/categories', bp.urlencoded({ extended: true}), bp.json({ limit: "50MB" }), (req, res) => {
        let category = {... req.body };
        console.log(".....category" + JSON.stringify(category));
        categoriesCollection
            .add(category)
            .then(result => res.status(200).json("Category added"))
            .catch(error => res.status(500).json(error));
        })

    /////////////////////////////////////////////////// UPDATE /////////////////////////////////////////////////////
    // Edit category
    router.put('/categories', bp.urlencoded({ extended: true }), bp.json({ limit: "50MB" }), (req, res) => {
        console.log(JSON.stringify(req.body));
        let category= {... req.body};
        let idValue = category.id;
        console.log(idValue);        
        categoriesCollection.doc(idValue).update(
            category,
            { merge: true });
            console.log(category)
        res.status(200).json(category);
    });

    /////////////////////////////////////////////////// DELETE /////////////////////////////////////////////////////
    router.delete('/categories', (req, res) => {
        let idValue = category.id;
        categoriesCollection.doc(idValue).delete().then((result) => {
            res.status(200).json(result);
        }).catch((error) => {
            res.status(500).json(error);
        });
    });

    return(router);

}