const { SlashCommand, CommandOptionType } = require('slash-create');
const { client, logger } = require('../index.js');
const Discord = require('discord.js');

module.exports = class MysteryCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'jail',
      description: 'Jail a user by removing all but one special role',
      guildIDs: ['660685280717701120'],
      throttling: {
        usages: 2,
        duration: 5,
      },
    });
  }

  async run(ctx) {

      return ctx.send("Under construction...", { ephemeral: true });

  }

  static name = "jail";
  static perm = "ADMINISTRATOR";
  static description = "Will jail the specified user and assign them a single \"quarantine\" role";

}
