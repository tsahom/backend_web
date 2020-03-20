const fs = require("fs");

const databasename = process.argv[2];

if(!databasename){
    console.error("Missing argument : nmp script.js databasename");
    process.exit(1);
}

fs.readFile(databasename,"utf8", (err, data) => {
    if(err){
        console.error(err);
        return;
    }
    console.log(data);
});