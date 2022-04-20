const express = require("express"),
  app = express(),
  port = process.env.PORT || 5000,
  cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const multer = require('multer');
const { hash } = require('node-image-hash');
const imageHash = require('node-image-hash');
var Jimp = require("jimp");
var Buffer=require("buffer");
var compare=require("hamming-distance");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
  })

const upload = multer({ storage: storage })
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "12345",
  database: "LoginSystem",
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    console.log(req.session.user)
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  console.log(password);

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }

    db.query(
      "INSERT INTO users (username, password) VALUES (?,?)",
      [username, hash],
      (err, result) => {
        console.log(err);
      }
    );
  });
});



app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE username = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            req.session.user = result;
            console.log(req.session.user);
            res.send(result);
          } else {
            res.send({ message: "Wrong username/password combination!" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});


global.image1 =""
global.image2=""
var SimilarityChecker=0;
app.post('/image1', upload.single('file'), function (req, res) {
   image1 = req.file.filename;
    // global.image1=image1.data["name"];
    console.log(typeof(image1))
  });

app.post('/image2', upload.single('file'), function (req, res) {
    const image2 = req.file.filename;
    // global.image2=image2.data["name"];
    arr=[];
    console.log("./images/"+image1);
imageHash
  .hash("./images/"+image1, 8, 'binary')
  .then((hash1) => {
    // console.log(hash1);
    arr[0]=hash1.hash;
    // console.log(arr[0]);

    imageHash.hash("./images/"+image2, 8, 'binary').then((hash2) => {
      img2=hash2.hash;
       console.log(img2);
      arr[1]=hash2.hash;
    //   console.log(arr[0]);
    //  JSON.stringify(arr[0]);
    //  JSON.stringify(arr[1]);
      var d=compare(arr[0], arr[1]);
      console.log(d);
       var p=(d/64);
       if(p>0.25){
         SimilarityChecker=1;
         console.log("Dissimilar");
         if(SimilarityChecker){
          var fileName = "./images/"+image1;
          var imageCaption = 'lala';
          var loadedImage;
          
          Jimp.read(fileName)
              .then(function (image) {
                  loadedImage = image;
                  return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
              })
              .then(function (font) {
                  loadedImage.print(font, 10, 10, imageCaption)
                             .write(fileName);
                  
              })
              .catch(function (err) {
                  console.error(err);
              });
            }
           // res.redirect('/dis');
          }
          else{
            console.log("Similar");
           // res.redirect('/sim');
           }
           });
         }); 
    });

    
 
  // app.get('/sim',function(req,res){
  //   res.send('Similar');
  // })
  // app.get('/dis',function(req,res){
  //   res.send('Disimilar');
  // })
app.listen(port, () => console.log("Backend server live on " + port));

app.get("/", (req, res) => {
  res.send({ message: "We did it!" });
});
