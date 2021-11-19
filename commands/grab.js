const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "grab",
  description: "Speichert den aktuellen Song in deinen Direktnachrichten",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["save"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Es läuft gerade nichts...**"
      );
    if (!player.playing)
      return client.sendTime(
        message.channel,
        "❌ | **Es läuft gerade nichts...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Du musst dich in einem Sprachkanal befinden, um etwas abzuspielen!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Du musst dich im selben Sprachkanal wie ich befinden, um diesen Befehl zu verwenden!**"
      );
    message.author
      .send(
        new MessageEmbed()
          .setAuthor(
            `Song saved`,
            client.user.displayAvatarURL({
              dynamic: true,
            })
          )
          .setThumbnail(
            `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
          )
          .setURL(player.queue.current.uri)
          .setColor(client.botconfig.EmbedColor)
          .setTitle(`**${player.queue.current.title}**`)
          .addField(
            `⌛ Duration: `,
            `\`${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}\``,
            true
          )
          .addField(`🎵 Author: `, `\`${player.queue.current.author}\``, true)
          .addField(
            `▶ Play it:`,
            `\`${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
            }play ${player.queue.current.uri}\``
          )
          .addField(`🔎 Saved in:`, `<#${message.channel.id}>`)
          .setFooter(
            `Requested by: ${player.queue.current.requester.tag}`,
            player.queue.current.requester.displayAvatarURL({
              dynamic: true,
            })
          )
      )
      .catch((e) => {
        return message.channel.send("**:x: Deine DMs sind deaktiviert**");
      });

    client.sendTime(message.channel, "✅ | **Bitte übersprüft deine DMs!**");
  },
  SlashCommand: {
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const user = client.users.cache.get(interaction.member.user.id);
      const member = guild.members.cache.get(interaction.member.user.id);
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Es läuft gerade nichts...**"
        );
      if (!player.playing)
        return client.sendTime(
          interaction,
          "❌ | **Es läuft gerade nichts...**"
        );
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **Du musst dich in einem Sprachkanal befinden, um diesen Befehl verwenden zu können.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          ":x: | **Du musst dich im selben Sprachkanal wie ich befinden, um diesen Befehl zu verwenden!**"
        );
      try {
        let embed = new MessageEmbed()
          .setAuthor(`Song saved: `, client.user.displayAvatarURL())
          .setThumbnail(
            `https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`
          )
          .setURL(player.queue.current.uri)
          .setColor(client.botconfig.EmbedColor)
          .setTimestamp()
          .setTitle(`**${player.queue.current.title}**`)
          .addField(
            `⌛ Duration: `,
            `\`${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}\``,
            true
          )
          .addField(`🎵 Author: `, `\`${player.queue.current.author}\``, true)
          .addField(
            `▶ Play it:`,
            `\`${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
            }play ${player.queue.current.uri}\``
          )
          .addField(`🔎 Saved in:`, `<#${interaction.channel_id}>`)
          .setFooter(
            `Requested by: ${player.queue.current.requester.tag}`,
            player.queue.current.requester.displayAvatarURL({
              dynamic: true,
            })
          );
        user.send(embed);
      } catch (e) {
        return client.sendTime(interaction, "**:x: Deine DMs sind deaktiviert**");
      }

      client.sendTime(interaction, "✅ | **Bitte übersprüft deine DMs!**");
    },
  },
};
