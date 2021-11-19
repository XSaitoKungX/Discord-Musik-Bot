const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "seek",
  description: "Suche nach einer Position im Lied",
  usage: "<time s/m/h>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["forward"],
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
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Du musst dich in einem Sprachkanal befinden, um diesen Befehl zu verwenden!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Du musst dich im selben Sprachkanal wie ich befinden, um diesen Befehl zu verwenden!**"
      );
    if (!player.queue.current.isSeekable)
      return client.sendTime(
        message.channel,
        "❌ | **Ich kann dieses Lied nicht suchen!**"
      );
    let SeekTo = client.ParseHumanTime(args.join(" "));
    if (!SeekTo)
      return client.sendTime(
        message.channel,
        `**Usage - **\`${GuildDB.prefix}seek <number s/m/h>\` \n**Example - **\`${GuildDB.prefix}seek 2m 10s\``
      );
    player.seek(SeekTo * 1000);
    message.react("✅");
  },
  
  SlashCommand: {
      options: [
          {
              name: "position",
              description: "Du gibst einen Zeitstempel ein, nach dem du suchen möchtest. Beispiel - 2m 10s",
              value: "position",
              type: 3,
              required: true,
              /**
              *
              * @param {import("../structures/DiscordMusicBot")} client
              * @param {import("discord.js").Message} message
              * @param {string[]} args
              * @param {*} param3
              *
              */
              run: async (client, interaction, args, { GuildDB }) => {
                  const guild = client.guilds.cache.get(interaction.guild_id);
                  const member = guild.members.cache.get(interaction.member.user.id);
                  let player = await client.Manager.get(interaction.guild_id);
                    
                  if (!member.voice.channel) return client.sendTime(interaction, "❌ | **Du musst dich in einem Sprachkanal befinden, um diesen Befehl verwenden zu können.**");
                  if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **Du musst dich im selben Sprachkanal wie ich befinden, um diesen Befehl zu verwenden!**");
                  if (!player) return client.sendTime(interaction, "❌ | **Es läuft gerade nichts...**");
                  if (!player.queue.current.isSeekable) return client.sendTime(interaction, "❌ | **Ich kann dieses Lied nicht suchen!**");
                  let SeekTo = client.ParseHumanTime(interaction.data.options[0].value);
                  if (!SeekTo) return client.sendTime(interaction, `**Usage - **\`${GuildDB.prefix}seek <number s/m/h>\` \n**Example -** \`${GuildDB.prefix}seek 2m 10s\``);
                  player.seek(SeekTo * 1000);
                  client.sendTime(interaction, "✅ | **Das Lied wurde erfolgreich verschoben nach **", `\`${Seekto}\``);
              },
          },
      ],
  },
};
