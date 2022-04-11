var https = require("https");
var config = require("../config");

var boundary = "xxxxxxxxxxxxxxxxxxxxxx";

module.exports = async function(imageBuffer, userName) {
    var bodyBuffer = singlePartMultipart("image", imageBuffer, "image/png");

    return new Promise(function(resolve, reject) {
        var r = https.request({
            hostname: "api.imgbb.com",
            path: `/1/upload?key=${config.IMGBB_TOKEN}`,
            method: "POST",
            headers: {
                "content-type": `multipart/form-data; boundary=${boundary}`
            },
        }, function(res) {            
            var body = "";
            res.on("data", chunk => body += chunk);
            res.on("close", function() {

                if (res.statusCode != "200") {
                    reject(`bad status code " + ${res.statusCode}\n${body}`);
                } else {
                    try {
                        var j = JSON.parse(body);
                        resolve(j.data.image.url);
                    } catch(e) {
                        console.error(e);
                        console.error(body);
                        reject("Bad body in uploading!");
                    }
                }
            })
        });
        
        r.write(bodyBuffer, function() {
            r.end();
        });
    });
}


function singlePartMultipart(title, buffer, type) {

    title = slugify(title);

    var headers = [
        `Content-Disposition: form-data; name="${title}"; filename="${userName}.png"\r\n`,
        `Content-Type: ${type}\r\n`
    ]

    var headerBuffer = Buffer.from(`\r\n--${boundary}\r\n${headers.join("")}\r\n`, "utf-8");
    var tailerBuffer = Buffer.from(`\r\n--${boundary}--\r\n`, "utf-8");

    return Buffer.concat([headerBuffer, buffer, tailerBuffer]);
}

function slugify(t) {
    return (t + "").replace(/[^\w-]+/g, "-");
}