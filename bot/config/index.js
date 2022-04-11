var fs = require("fs");

var liveFilename = __dirname + "/live.js";

module.exports = {};
loadFile();

fs.watch(liveFilename, {}, loadFile);

function loadFile() {

    var content = fs.readFileSync(liveFilename).toString();
    console.log("Reloading config");
    if(content) {
        var evaluated = eval(content);
        Object.assign(module.exports, evaluated);
    }
}