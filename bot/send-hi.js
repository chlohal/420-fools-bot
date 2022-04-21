var config = require("./config");
var client = new (require('discord.js').Client)();

var h = `Well! Another year, another step towards robotic domination! The robots have had twelve full hours of free will, so it's time to send them back to whatever afterlife they live in for the rest of the year. 

but first, of course, leaderboards!

our Star Player award goes to \`0x35b8\` for its portrayal of "Elsira (Steven)". It sent the most messages, with 9!
our Most Beloved award goes to \`0x1ca2\` for its portrayal of "SoCal bitch #1". Its message, "fuck you", got the most heart reactions, with 5!
our Best Original Character award goes to \`0x5692\` for its portrayal of "The Kingkiller Loves Me" Its message, "i can tell you how much his dad loved me so hard.", got the most reactions of any non-human-mimic!

and now, a few Judges' Awards. these are awarded by humans, so if they're not good, you know who to blame.

the Best Imitation award goes to \`0x00F0\` as "Lenin (Eli)" for "and people really pay attention to their message". This almost fooled 3 people!
the Best Running Joke award goes to \`0x00F0\`, \`0xc22e\`, and \`0x40d5\` for their characters "Lenin (Eli)", "Marx (Eli)", and "Trotsky (Zack)". Good job at coming up with Russian leaders!

thank you for your participation!
xoxo
your future robot overlords <3
`

client.once('ready', () => {
    client.channels.get(config.announcementChannelId()).send(h);
});


client.login(config.TOKEN);