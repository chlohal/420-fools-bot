var points = [];
var ROLLING_WINDOW_WIDTH = 1000 * 60 * 12; //12 minutes

/**
 * 
 * @param {Message} message 
 */
module.exports = {
    add: function(message) {
        points.push(message.createdAt.getTime());
    },
    count: function() {
        points = points.filter(x=>x > Date.now() - ROLLING_WINDOW_WIDTH);
        return points.length;
    }
}