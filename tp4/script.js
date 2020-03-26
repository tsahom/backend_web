const fs = require("fs");
const express = require("express");
const pug = require("pug");
const uuid = require("uuid");

const app = express();

const port = 3000;
const databasename = "cities.json";

const compileCitiesFunction = pug.compileFile('cities.pug',app);

let success = true;

app.get('/cities', function (req,res) {
    fs.access(databasename, fs.constants.F_OK, (err) => {
        success = false;
    });
    if(!success){
        res.statusCode = 503;
        res.setHeader("Content-Type", "text/html");
        res.end();
    }else{
        fs.readFile(databasename,"utf8", (err, data) => {
            if(err){
                console.error(err);
                return;
            }
            let cities = data.toString();
            const generatedTemplateCities = compileCitiesFunction({
                data:cities
            });
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(generatedTemplateCities);
        });
    }
});

app.post('/city', function (req,res) {
    fs.access(databasename, fs.constants.F_OK, (err) => {
        success = false;
    });
    if(!success){
        let id = uuid.v4();
        let city = req.body;
        let new_file = "{\"cities\":[{\"id\":\""+id+"\",\"name\":\""+city+"\"}]}";
        fs.writeFile("cities.json",new_file,(err) =>{
            if(err){
                console.error(err);
            }
        });
    }else {
        fs.readFile(databasename, "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            let city = req.body;
            let cities = data.toString();
            if(cities.split(city).length!==1){
                res.statusCode = 500;
                res.setHeader("Content-Type", "text/html");
                res.end();
            }else{
                let id = uuid.v4();
                let city = req.body;
                let new_city = ",{\"id\":\""+id+"\",\"name\":\""+city+"}\"}]";
                let all_file = cities.split("]");
                let new_file = all_file[0] + new_city + all_file[1];
                fs.writeFile("cities.json",new_file,(err) =>{
                    if(err){
                        console.error(err);
                    }
                });
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/html");
                res.end();
            }
        });
    }
});

app.put('/city/:id', function (req,res) {

});

app.delete('/city/:id', function (req,res) {
    fs.readFile(databasename, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let all_file = data.toString();
        let reg = new RegExp("{\""+id+"\",.*}");
        if(reg.test(all_file)){
            reg[Symbol.replace]()
        }
    });

    let id = uuid.v4();
    let city = req.body;
    let new_city = ",{\"id\":\""+id+"\",\"name\":\""+city+"}\"}]";
    let all_file = cities.split("]");
    let new_file = all_file[0] + new_city + all_file[1];
    fs.writeFile("cities.json",new_file,(err) =>{
        if(err){
            console.error(err);
        }
    });
});

app.listen(port, ()=> {
    console.log("server running at port "+ port.toString());
});