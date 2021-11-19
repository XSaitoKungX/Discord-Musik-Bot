const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "youtube",
  description: "Startet eine YouTube Together-Sitzung",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["yt"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {require("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Du musst dich in einem Sprachkanal befinden, um etwas abzuspielen!**"
      );
    if (
      !message.member.voice.channel
        .permissionsFor(message.guild.me)
        .has("CREATE_INSTANT_INVITE")
    )
      return client.sendTime(
        message.channel,
        "❌ | **Bot hat keine Berechtigung zum Erstellen von Einladungen**"
      );

    let Invite = await message.member.voice.channel.activityInvite(
      "755600276941176913"
    ); //Made using discordjs-activity package
    let embed = new MessageEmbed()
      .setAuthor(
        "YouTube Together",
        "https://cdn.discordapp.com/emojis/749289646097432667.png?v=1"
      )
      .setColor("#FF0000").setDescription(`
Mit **YouTube Together** kannst du YouTube mit deinen Freunden in einem Sprachkanal ansehen. Klicke auf *Join YouTube Together*, um mitzumachen!

__**[Join YouTube Together](https://discord.com/invite/${Invite.code})**__

⚠ **Note:** Dies funktioniert nur im Desktop!!
`);
    message.channel.send(embed);
  },
  SlashCommand: {
    options: [],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | Du musst dich in einem Sprachkanal befinden, um diesen Befehl verwenden zu können."
        );
      if (
        !member.voice.channel
          .permissionsFor(guild.me)
          .has("CREATE_INSTANT_INVITE")
      )
        return client.sendTime(
          interaction,
          "❌ | **Bot hat keine Berechtigung zum Erstellen von Einladungen**"
        );

      let Invite = await member.voice.channel.activityInvite(
        "755600276941176913"
      ); //Made using discordjs-activity package
      let embed = new MessageEmbed()
        .setAuthor(
          "YouTube Together",
          "https://cdn.discordapp.com/emojis/749289646097432667.png?v=1"
        )
        .setColor("#FF0000").setDescription(`
Mit **YouTube Together** kannst du YouTube mit deinen Freunden in einem Sprachkanal ansehen. Klicke auf *Join YouTube Together*, um mitzumachen!

__**[Join YouTube Together](https://discord.com/invite/${Invite.code})**__

⚠ **Note:** Dies funktioniert nur im Desktop!!
`);
      interaction.send(embed.toJSON());
    },
  },
};
