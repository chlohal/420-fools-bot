module.exports = ({
    defaultAvatar: "https://www.teenwiseseattle.com/wp-content/uploads/2017/04/default_avatar.png",
    TOKEN: require("./token.json"),
    IMGBB_TOKEN: require("./imgbb-token.json"),
    AI_TEXT_TOKEN: require("./ai-token.json"),
    announcementChannelId: function() {
        return "525485048305287189";
    },
    chanceCoefficientOnFail: function() {
        return 1.1;
    },
    initialChance: function() {
        return 0.3;
    },
    cooldown: function() {
        return 1000 * 60 * 5;
    },
    contextMessageCount: function() {
        return 5;
    },
    textgenRetryTimes: function() {
        return 5;
    },
    placeholderImageUrl: function() {
        return `http://placeimg.com/100/100/any/greyscale`;
    },
    shouldNeverReplyToMessage: function(message) {
        //don't send to non-NHS
        if(message.guild.id != "392830469500043266") return true;

        //#counting
        if(message.channel.id == "632192195633348617") return true;
    }
})