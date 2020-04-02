const express = require("express");
const pug = require("pug");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/TP_Web", {useNewUrlParser:true});

const db = mongoose.connection;

const citySchema = new mongoose.Schema({name:String});

const City = mongoose.model("City",citySchema);

db.on("error",console.error.bind(console,"connection error"));
db.once("open",function () {

});

const app = express();
app.use(express.json());

const port = 3000;

const compileCitiesFunction = pug.compileFile('cities.pug',app);

app.get('/cities', function (req,res) {
    City.find(function (err,cities) {
        if(err){
            res.statusCode = 503;
            res.setHeader("Content-Type", "text/html");
            res.end();
        }else{
            const generatedTemplateCities = compileCitiesFunction({
                data:cities
            });
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(generatedTemplateCities);
        }
    });
});

app.post('/city', function (req,res) {
    let cityname = req.body.city;
    const city = new City({name: cityname});
    City.save(function (err) {
        if (err) {
            console.log(err);
        }
        City.find(function (err, cities) {
            const generatedTemplateCities = compileCitiesFunction({
                data: cities
            });
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(generatedTemplateCities);
        });
    });
});

app.put('/city/', function (req,res) {
    City.updateOne({_id:req.query.id},{name:req.body.name}, function (err, res) {
        if(err){
            console.log(err);
        }
    });
    City.find(function (err, cities) {
        const generatedTemplateCities = compileCitiesFunction({
            data: cities
        });
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(generatedTemplateCities);
    });
});

app.delete('/city/', function (req,res) {
    City.deleteOne({_id:req.query.id}, function (err, res) {
        if(err){
            console.log(err);
        }
    });
    City.find(function (err, cities) {
        const generatedTemplateCities = compileCitiesFunction({
            data: cities
        });
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(generatedTemplateCities);
    });
});

app.listen(port, ()=> {
    console.log("server running at port "+ port.toString());
});