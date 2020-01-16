const express = require('express')
let bodyParser = require("body-parser");
let db = require('./db.js');
const app = express()
const port = 8080

let ObjectID = require('mongodb').ObjectID;

    app.use(bodyParser.json());

    // GET method route
    app.get('/', function (req, res) {
        res.send('GET request to the homepage')
    })
  
    // POST method route
    app.post('/', function (req, res) {
        res.send('POST request to the homepage')
    })

    app.post('/profile/update', async function (req, res) {
            
        try {
            db.dbUpdate("profiles", {_id : ObjectID(req.body._id)}, req.body)
            res.send('Received, profile updated.')
        } catch (error) {
            res.send(error)
        }
    
    })

    app.get('/profile/get', async function (req, res) {

        let obj = await db.dbFind("profiles", {})
        
        res.status(200)
        res.json(obj[0])
    })

    //generate dummy db data
    app.get('/profile/generate', function (req, res) {
        let obj = {
            dummyid: "dummy1",
            username: "jonmcnamara",
            profile: "https://media-exp2.licdn.com/dms/image/C5603AQFA_oQhi6-2Cg/profile-displayphoto-shrink_800_800/0?e=1584576000&v=beta&t=QfVEJg5DU7IHXBiUlaZ2nRjI5gHTqok20eL17iHHa8Y",
            firstname : "John",
            lastname : "McNamara",
            description : "John is a Senior Inventor, Research Fellow, Impact Fellow and currently provides technical leadership for the IBM Hursley Innovation Centre. John has a diverse background that includes consultancy, performance, service & product delivery, all underpinned by a passion for innovation. Most recently his work leading the Innovation Centre technologist team has allowed him to combine these interests in order to maximise the potential of new technology while solving real problems. John has overseen the delivery of many cognitive cloud-based solutions and understands how to combine technologies to quickly provide value for customers. John is an active inventor with an invention portfolio spanning mobile, A.I, messaging, integration and predictive analytics.",
            experience: "Senior Inventor at IBM and Hursley Innovation Labs Technologist Lead",
            education : "I have studied at University of Humberside, on Field Of StudyInformation Systems. And received a 2:1 Grade",
            gender : 2
        }
        db.dbInsert("profiles", obj);
        res.status(200)
        res.json("SUCCESS")
    })



    app.get('/history/get', async function (req, res) {

        console.log("get history of id ", req.body._id)
        let obj = await db.dbFind("history", {userid : ObjectID(req.body._id)})
        
        res.status(200)
        res.json(obj)
    })



    app.post('/history/add', async function (req, res) {


            console.log("add history of id ", req.query.id)
            let obj = await db.dbUpdate("history", {userid : ObjectID(req.body._id)}, { $push: { history: req.body } } )
            
            res.status(200)
            res.send("should be updated")
        
    })


    app.listen(port, () => console.log(`app listening on port ${port}!`))