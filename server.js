var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var jwt = require('jsonwebtoken');

var path = require("path");

// console.log("module: ", userModel);
var { SERVER_SECRET } = require("./core/index");


var { userModel, otpModel } = require("./dbrepo/models");
var authRoutes = require("./routes/auth");

var app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(morgan('dev'));

// example how to send file any requrest

// app.get("/", (req, res, next) => {
//     console.log(__dir);
//     res.sendFile(path.resolve(path.join(__dirname, "public")))
// })

app.use("/", express.static(path.resolve(path.join(__dirname, "public"))))

app.use('/', authRoutes);


app.use(function (req, res, next) {

    console.log("req.cookies: ", req.cookies);

    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {

            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate; // 84600,000

            if (diff > 300000) { // expire after 5 min (in milis)
                res.send({
                    message: "TOKEN EXPIRED",
                    status: 401
                });
            } else { // issue new Token
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                    phone: decodedData.phone,
                    gender: decodedData.gender
                }, SERVER_SECRET)

                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                next();
            }
        } else {
            res.send({
                message: "Invalid Token",
                status: 401
            });
        }


    });

});

app.get("/profile", (req, res, next) => {
    console.log(req.body);

    userModel.findById(req.body.jToken.id, 'name email phone gender createdOn', function (err, doc) {
        if (!err) {
            res.send({
                profile: doc
            })
            
        } else {
            res.send({
                message: "Server Error",
                status: 500
            });
        }
    });
})
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server is Running :", PORT);
})