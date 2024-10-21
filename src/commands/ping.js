const { SlashCommand, CommandOptionType } = require('slash-create');
const { client, logger } = require('../index.js');
const Discord = require('discord.js');

module.exports = class PingCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'ping',
      description: 'Pong around and find out',
      guildIDs: ['660685280717701120'],
      throttling: {
        usages: 2,
        duration: 5,
      },
    });
  }

  async run(ctx) {

        await ctx.defer(true);

        let total = 0;

        let ping = client.ws.shards.get(0).ping; // client.ws.ping  would also work
        let symbol = ping < 0 ? ":exclamation:" : ping < 100 ? ":green_square:" : ping < 200 ? ":orange_square:" : ":red_square:";
        let msg = `${symbol} API Latency is **${(ping)}**ms ${symbol}`;
        total += ping;

        let teste = new Discord.EmbedBuilder()
            .setTitle(":ping_pong:  PONG  :ping_pong:")
            .setTimestamp()
            .setColor('Random')
            .setDescription(`${msg}\nCalculating Client ping... (please wait)`);

        const prev = await ctx.send("", { embeds: [ teste ], ephemeral: true });

        ping = Math.floor(Date.now() - ctx.invokedAt);
        symbol = ping <= 0 ? ":exclamation:" : ping < 500 ? ":green_square:" : ping < 750 ? ":orange_square:" : ":red_square:";
        msg += `\n${symbol} Bot Latency is **${ping}**ms ${symbol}`;
        total += ping;

        ping = prev.timestamp - ctx.invokedAt;
        symbol = ping <= 0 ? ":exclamation:" : ping < 200 ? ":green_square:" : ping < 450 ? ":orange_square:" : ":red_square:";
        msg += `\n${symbol} Message Latency is **${ping}**ms ${symbol}`;
        total += ping;

        msg += '\n';

        symbol = total <= 0 ? ":exclamation:" : total < 700 ? ":green_square:" : total < 900 ? ":orange_square:" : ":red_square:";
        msg += `\n${symbol} __TOTAL__: **${total}**ms ${symbol}`;

        teste = new Discord.EmbedBuilder()
            .setTitle(":ping_pong:  PONG  :ping_pong:")
            .setTimestamp()
            .setColor('Random')
            .setDescription(`${msg}`);

        return ctx.editOriginal({embeds: [ teste ], ephemeral: true});
  }
}
