const { SlashCommand, CommandOptionType } = require('slash-create');
const client = require('../index.js');

module.exports = class HelloCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'hello',
      description: 'Says hello to you.',
      options: [{
        type: CommandOptionType.STRING,
        name: 'food',
        description: 'What food do you like?'
      }],
      guildIDs: ['660685280717701120']
    });
  }

  async run(ctx) {
    return ctx.options.food ? `You like ${ctx.options.food}? Nice!` : `Hello, ${ctx.member.displayName}!`;
  }
}