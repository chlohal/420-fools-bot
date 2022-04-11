var fs = require("fs");

var liveFilename = __dirname + "/live.js";

module.exports = require("./live");
loadFile();

fs.watch(liveFilename, {}, loadFile);

function loadFile() {

    var content = fs.readFileSync(liveFilename).toString();
    console.log("Reloading config");
    if(content) {
        var evaluated = eval(`(function() { var module = {};  ${content}; return module.exports; })()`);
        Object.assign(module.exports, evaluated);
    }
}