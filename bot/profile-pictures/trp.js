const resolvePlaceholder = require("./resolve-placeholder");

(async function() {
    var f = await resolvePlaceholder();
    console.log(f);
})();