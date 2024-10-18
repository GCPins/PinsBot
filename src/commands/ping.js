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

        let msg = `API Latency is **${(client.ws.ping)}**ms`;

        ctx.send(msg, { ephemeral:true });

  }
}