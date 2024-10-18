const { SlashCommand, CommandOptionType } = require('slash-create');
const client = require('../index.js');
const Discord = require('discord.js');

module.exports = class PingCommands extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'ping',
      description: 'Pong around and find out...',
      guildIDs: ['660685280717701120'],
      throttling: {
        usages: 2,
        duration: 5,
      },
    });
  }

  async run(ctx) {

        await ctx.defer();

        console.log(client.ws.shards.get(0));

        let ping = client.ws.shards.get(0).ping;
        let symbol = ping <= 0 ? ":exclamation:" : ping < 100 ? ":green_square:" : ping < 200 ? ":orange_square:" : ":red_square:";

        let msg = `${symbol} API Latency is **${(ping)}**ms ${symbol}`;

        let teste = new Discord.EmbedBuilder()
            .setTitle(":ping_pong: PONG :ping_pong:")
            .setTimestamp()
            .setColor('Random')
            .setDescription(`${msg}\nCalculating Client ping... (please wait)`);

        //const prev = await ctx.send(`${msg}\nCalculating Client ping... (please wait)`);

        const prev = await ctx.send("", { embeds: [ teste ] });

        ping = Math.floor(prev.timestamp - ctx.invokedAt);
        symbol = ping <= 0 ? ":exclamation:" : ping < 100 ? ":green_square:" : ping < 200 ? ":orange_square:" : ":red_square:";
        msg += `\n${symbol} Client Latency is **${ping}**ms ${symbol}`;

        teste = new Discord.EmbedBuilder()
            .setTitle(":ping_pong: PONG :ping_pong:")
            .setTimestamp()
            .setColor('Random')
            .setDescription(`${msg}`);

        return ctx.editOriginal({embeds: [ teste ]});

  }
}