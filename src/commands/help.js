const { SlashCommand, CommandOptionType, Command } = require('slash-create');
const { client, logger } = require('../index.js');
const Discord = require('discord.js');

module.exports = class HelpCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'help',
      description: 'Shows the bot\'s help menu',
      guildIDs: ['660685280717701120'],
      throttling: {
        usages: 2,
        duration: 5,
      },
      options: {
        name: 'command',
        description: 'The command to get more info on',
        type: CommandOptionType.STRING
      }
    });
  }

  async run(ctx) {

      return ctx.send("Under construction...", { ephemeral: true });

  }
}
