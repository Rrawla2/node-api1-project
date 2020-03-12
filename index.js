// implement your API here
const db = require("./data/db");
const express = require("express");
const shortid = require("shortid");
const server = express();

server.listen(4000, () => {
    console.log("Listening on port 4000...")
})

server.use(express.json());


// server.get("/", (req, res) => {
//     res.send("Hello World!");
// })

// Get the users
server.get("/api/users", (req, res) => {
    db.find()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The users information could not be retrieved." })
        })
    })

// Get a user by ID
server.get("/api/users/:id", (req, res) => {
    const { id } = req.params;
    db.findById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
        res.status(500).json({ errorMessage: "The user information could not be retrieved." })
        })   
    })

// Add a user
server.post("/api/users", (req, res) => {
    const userInfo = req.body;
    

    db.insert(userInfo)
        .then(user => {
            if (userInfo.name && userInfo.bio) {
                userInfo.id = shortid.generate();
                res.status(201).json(userInfo)
            } else {
                res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
        })
})


// Delete a user
server.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    db.remove(id)
        .then(user => {
            if (user) { 
                res.status(200).json(user)
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The user could not be removed" })
        })

})

// Update a user
server.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    db.update(id, updates)
        .then(user => {
            if (updates.name && updates.bio) {
                res.status(200).json(updates)
            } else if (!updates.name || !updates.bio) {
                res.status(400).json({ message: "Please provide name and bio for the user." })
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "The user information could not be modified." })
        })
})