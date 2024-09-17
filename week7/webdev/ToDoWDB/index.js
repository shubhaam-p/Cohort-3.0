const express = require('express');
const {UserModel, TodoModel} = require("./db");
const {auth, JWT_SECRET} = require("./auth");
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")
const saltRounds = 8;

mongoose.connect("mongodb+srv://admin:pOrcmi0xaqbqIpkc@cluster0.bgihn.mongodb.net/to_do")
const app = express();
app.use(express.json());

async function checkUserExists(req, res, next){
    let username = req.body.username;
    let email = req.body.email;
    const response = await UserModel.findOne({
        email: email,
    });
    console.log(response);
    if(response)
        res.send("User exists");
    else
        next();
}

function hashPwd(req, res, next){
    let password = req.body.password;

    bcrypt
  .genSalt(saltRounds)
  .then(salt => {
    console.log('Salt: ', salt)
    return bcrypt.hash(password, salt)
  })
  .then(hash => {
    req.body.hash = hash;
    console.log('Hash: ', hash)
    next();
  })
  .catch(err => console.error(err.message))
}

app.use('/signup',checkUserExists, hashPwd, async function (req, res, next){
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.hash;
    await UserModel.create({
        email: email,
        password: password,
        name: username
    });
    
    res.json({
        message: "You are signed up"
    })
})

async function validateUser(req, res, next){
    let password = req.body.password;
    let email = req.body.email;
    const response = await UserModel.findOne({
        email: email,
    });

    if(response){
        console.log(response,"Found user");
        let hash = response.password;

        bcrypt
        .compare(password, hash)
        .then(result => {
          console.log(result, "Creds matched") 
          if(result){
            req.body.userId = response._id.toString();
            next();
          }
          else
           res.status(403).send("Incorrect creds");
        })
        .catch(err => console.error(err.message));
    }else
       res.send("Sign in first")        
}

app.use('/signin', validateUser, async function (req, res, next){
    let userId = req.body.userId;

    const token = jwt.sign({
        id: userId
    }, JWT_SECRET);

    res.json({
        token:token
    })
})

function veifyToken(req, res, next){
    let token = req.headers.token;
    let verified = jwt.verify(token, JWT_SECRET);
    if(verified){
        req.headers.token = verified.id;
        next();
    }else
        res.status(403).send("Please log in");
}

app.use('/todo', veifyToken, async function (req, res, next){
    let token = req.headers.token;

    console.log(token, 'idd ');
    let title = req.body.title;
    const response = await TodoModel.create({
        userId: token,
        title: title,
        done:false
    });

    if(response){
        res.send("Task added!");
    }else
        res.send("Error!")

})

app.use('/todos', veifyToken, async function (req, res, next){
    let token = req.headers.token;
    console.log(token, 'idd ');
    const response = await TodoModel.find({
        userId: token,
    });
    console.log(response);
    res.send(response);
})


app.listen(3000);