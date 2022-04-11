module.exports = ({
    defaultAvatar: "https://www.teenwiseseattle.com/wp-content/uploads/2017/04/default_avatar.png",
    TOKEN: require("./token.json"),
    AI_TEXT_TOKEN: require("./ai-token.json"),
    chanceCoefficientOnFail: function() {
        return 10;
    },
    initialChance: function() {
        var now = new Date();
        if(now.getMonth() == 3 && now.getDate() == 1) return 0.1;
        else return 1;
    },
    cooldown: function() {
        return 0;1000 * 60 * 5;
    },
    contextMessageCount: function() {
        return 5;
    }
})