const fs = require("fs");
const http = require("http");
const pug = require("pug");

const compileFunction = pug.compileFile('template.pug',http);
const port = 3000;
const databasename = "data.csv";

const server = http.createServer((req,res)=> {
    let parameter = [];
    req.on("data", chunk => {
        parameter.push(chunk);
    });
    req.on("end", () => {
        console.log(parameter);
    });

    fs.readFile(databasename,"utf8", (err, data) => {
        if(err){
            console.error(err);
            return;
        }
        let lines = data.toString().split(/\r\n|\n/);
        let table = [];
        let i = 0;
        for (let line of lines) {
            if (line.length !== 2) {
                table += "";
            }
            let val = line.split(';');
            table[i] += "<td>"+val[0]+"</td><td>"+val[1]+"</td>";
            i++;
        }
        const generatedTemplate = compileFunction({
            data:table
        });
        requestok(generatedTemplate, res);
    });

});

server.listen(port, ()=> {
    console.log("server running at port "+ port.toString());
});

function requestok(generatedTemplate, res){
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(generatedTemplate);
}