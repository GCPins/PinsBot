const { SlashCommand, CommandOptionType } = require('slash-create');
const client = require('../index.js');

module.exports = class MoveallCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'moveall',
      description: 'Move all users from one voice channel to another',
      options: [{
        type: CommandOptionType.CHANNEL,
        channel_types: [2],
        name: 'from',
        description: 'Channel to move everyone from'
      }, {
        type: CommandOptionType.CHANNEL,
        channel_types: [2],
        name: 'to',
        description: 'Channel to move everyone to',
      }],
      guildIDs: ['660685280717701120']
    });
  }

  async run(ctx) {

    let guild = client.guilds.cache.get(ctx.guildID);
    let executer = await guild.members.fetch(ctx.member.id); // use fetch!!

    if (!ctx.options.from) {
      // no from chosen, move all from the executer's current channel
      let fromchl = guild.channels.cache.get(ctx.options.from);
      console.log(fromchl)
      return ctx.send("Working on this command (check back later)...", { ephemeral: true });
    }
    if (!ctx.options.to) {
      // no to chosen, move all to the exectuer's current channel
      let tochl = guild.channels.cache.get(ctx.options.to);
      console.log(tochl);
      return ctx.send("Working on this command (check back later)...", { ephemeral: true });
    }

    // both are chosen
    let tochl = guild.channels.cache.get(ctx.options.to);
    let fromchl = guild.channels.cache.get(ctx.options.from);

    console.log(tochl, fromchl);

    return ctx.send("Working on this command (check back later)...", { ephemeral: true });
  }
}
