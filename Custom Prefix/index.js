const { Client, Intents } = require("discord.js");
const db = require("quick.db");
require("dotenv").config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.on("ready", () => {
  console.log(`${client.user.username} is Ready !`);
});

client.on("guildCreate", async (guild) => {
  const prefixes = await db.get(`prefixes_${guild.id}`);
  let prefix = "";
  if (prefixes === null) {
    prefix = "!";
  } else {
    prefix = prefixes;
  }
  db.set(`prefixes_${guild.id}`, prefix);
});

client.on("guildDelete", (guild) => {
  db.delete(`prefixes_${guild.id}`);
});

client.on("messageCreate", async (message) => {
  const prefixes = await db.get(`prefixes_${message.guild.id}`);
  let prefix = "";
  if (prefixes === null) {
    prefix = "!";
  } else {
    prefix = prefixes;
  }
  db.set(`prefixes_${message.guild.id}`, prefix);

  const args = message.content.split(" ");
  if (message.content.startsWith(prefix + "prefix")) {
    if (!message.member.permissions.has("ADMINISTRATOR")) return;
    if (!args[1]) return message.reply(`**${prefix}prefix \`New Prefix\`**`);
    if (args[1].length > 2)
      return message.reply(`**New Prefix can\`t be more than 2 Chars**`);
    db.set(`prefixes_${message.guild.id}`, args[1]);
    message.channel.send("**Done. Prefix Changed**");
  }
  let mention = message.mentions.members.first();
  if (mention) {
    if (mention.id === client.user.id)
      return message.reply(`**My prefix is \`${prefix}\`**`);
  }
});

client.login(process.env.TOKEN);
