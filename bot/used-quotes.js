var fs = require("fs");

var datafile = __dirname + "/savedata/used-quotes";

if(!fs.existsSync(datafile)) fs.writeFileSync(datafile, "");

var content = fs.readFileSync(datafile).toString("utf-8");
var contentQuotes = content.split(",");

module.exports = {
    /**
     * 
     * @param {Quote} quote 
     */
    add: function(quote) {
        fs.appendFileSync(datafile, "," + quote._id);
        contentQuotes.push(quote._id);
    },
    /**
     * 
     * @param {Quote} quote 
     */
    isAlreadyUsed: function(quote) {
        return contentQuotes.includes(quote._id);
    }
}