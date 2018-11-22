const express = require('express'),
      bp = require('body-parser'),
      admin = require('firebase-admin');
      
      
var db = admin.firestore();

var authorsCollection = db.collection('authors');

module.exports = function() {

    const router = express.Router();

    /////////////////////////////////////////////////// READ /////////////////////////////////////////////////////
    // GET array of authors
    router.get('/authors', (req, res) => {
        authorsCollection
        .get()
        .then(snapshot => {
            let authorsArr = [];
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                var returnResult = {
                    id: doc.id,
                    result: doc.data()
                }
                authorsArr.push(returnResult);       
        });
        res.status(200).json(authorsArr);
    })
    .catch(err => {
        console.log('Error getting documents', err);
        res.status(500).json(err);
        }); 
    });

    // Search by firstname & lastname    ->  api/authors/search?firstname=Charlie&lastname=Limmel
    router.get('/authors/search', (req, res) => {
        let firstname = req.query.firstname;
        let lastname = req.query.lastname;
        console.log(firstname, lastname);

        if (typeof(firstname === 'undefined') 
            && typeof(lastname === 'undefined')){
            if (firstname === ''
            && lastname === ''){
            console.log('firstname and lastname are undefined');
            res.status(500).json({error: "firstname and lastname are undefined"});
            }
        }

        authorsCollection
        .where('firstname', '==', firstname)
        .where('lastname', '==', lastname)
            .get()
            .then((result) => {
                let authorData = []
            
                authorData = result.docs.map(value => {
                    return value.data();
                });

                res.status(200).json(authorData)
            })
            .catch(err => {
                console.log('Error getting documents', err);
                res.status(500).json(err);
            })
    });


    // GET an author by id  ->   api/authors/tqAnMjzk79TEZbCVWBIO
    router.get('/authors/:id', (req, res) => {
        let idValue = req.params.id;
        
        authorsCollection
            .doc(idValue)
            .get()
            .then((result) => {
                console.log(result.data());
                var returnResult = {
                    id: idValue,
                    firstname : result.data().firstname,
                    lastname: result.data().lastname,
                    email: result.data().email,
                    profile: result.data().profile
                }
                res.status(200).json(returnResult)
            })
            .catch(err => {
                console.log('Error getting documents', err);
                res.status(500).json(err);
            })
    });


    /////////////////////////////////////////////////// CREATE /////////////////////////////////////////////////////
    // Add one author
    router.post('/authors', bp.urlencoded({ extended: true}), bp.json({ limit: "10MB" }), (req, res) => { 
        let author = { ...req.body };
        console.log(".....author" + JSON.stringify(author));
        authorsCollection
            .add(author)
            .then(result => res.status(200).json("Author name added"))
            .catch(error => res.status(500).json(error));
    })

    /////////////////////////////////////////////////// UPDATE /////////////////////////////////////////////////////
    // Edit author
    router.put('/authors', bp.urlencoded({ extended: true }), bp.json({ limit: "50MB" }), (req, res) => {
        console.log(JSON.stringify(req.body));
        let author = {... req.body};
        let idValue = author.id;
        console.log(idValue);
        authorsCollection.doc(idValue).update(
            author,
            { merge: true });
            console.log(author) 
        res.status(200).json(author);
    });

    /////////////////////////////////////////////////// DELETE /////////////////////////////////////////////////////
    // Delete an author
    router.delete('/authors', (req, res) => {
        let idValue = req.query.id;
        authorsCollection.doc(idValue).delete().then((result) => {
            res.status(200).json(result);
        }).catch((error) => {
            res.status(500).json(error);
        });
    });


    return(router);

}