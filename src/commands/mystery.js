const { SlashCommand } = require('slash-create');
const { client, logger } = require('../index.js');
const Discord = require('discord.js');

module.exports = class MysteryCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'mystery',
      description: '?????',
      guildIDs: ['660685280717701120'],
      throttling: {
        usages: 1,
        duration: 5
      }
    });
  }

  async run(ctx) {
    return ctx.send('Under construction...', { ephemeral: true });
  }

  static name = 'mystery';
  static perm = '';
  static description = 'd5397#%%x038  _4 2_4233ndaJAH1';
};
