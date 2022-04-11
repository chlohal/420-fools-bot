var fs = require("fs");
var quotes = require("../data/quotes.json");

var genres = {};

quotes.forEach(x=>{
    if(!genres[x.quoteGenre]) genres[x.quoteGenre] = [];
    genres[x.quoteGenre].push(x);
});

Object.entries(genres).forEach(x=> {
    fs.writeFileSync(__dirname + `/../data/genres/${x[0]}.json`, JSON.stringify(x[1]));
})