var fs = require("fs");

var authors = require("../data/authors.json");
authors.forEach(x=>x.images = x.images || []);
authors.forEach(x=>x.wikiId = x.wikiId || "");

authors.forEach(x=>{
    x.images = x.images.filter(x=>x.endsWith("png") || x.endsWith("jpg"));
})

fs.writeFileSync(__dirname + "/../data/authors.json", JSON.stringify(authors));
