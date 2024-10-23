const { SlashCommand, CommandOptionType } = require('slash-create');
const { client, logger } = require('../index.js');

module.exports = class MoveallCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'moveall',
      description: 'Move all users from one voice channel to another',
      options: [
        {
          type: CommandOptionType.CHANNEL,
          channel_types: [2],
          name: 'from',
          description: 'Channel to move everyone from'
        },
        {
          type: CommandOptionType.CHANNEL,
          channel_types: [2],
          name: 'to',
          description: 'Channel to move everyone to'
        }
      ],
      guildIDs: ['660685280717701120'],
      requiredPermissions: ['MOVE_MEMBERS'],
      defaultPermission: false
    });
  }

  async run(ctx) {
    let guild = client.guilds.cache.get(ctx.guildID);
    let executer = await guild.members.fetch(ctx.member.id); // use fetch!!

    if (!ctx.options.to && !ctx.options.from) {
      // neither chosen, move all users in any vc to the current/executer's channel
      //return ctx.send("Working on this command (check back later)...", { ephemeral: true });

      let _fromchls = await guild.channels.fetch();
      let tochl = executer.voice.channel;

      if (!tochl)
        return ctx.send(`You are not in a voice channel. Please use the full command or join a voice channel.`, {
          ephemeral: true
        });

      let fromchls = [];
      let chlstr = '';
      _fromchls.forEach((c) => {
        if (c.type == 2) {
          if (c == tochl) return;
          fromchls.push(c);
          if (c.members.size) chlstr += `${c} (\`${c.id}\`), `;
        }
      });

      if (!chlstr) {
        return ctx.send(`No users were detected (aside from yourself) - go find some "friends" before trying again.`, {
          ephemeral: true
        });
      }

      let numU = 0;
      fromchls.forEach((c) => {
        c.members.forEach((m) => {
          numU++;
          m.voice.setChannel(tochl);
        });
      });

      return ctx.send(
        `Moved **${numU}** user(s) from ${chlstr.slice(0, -1).slice(0, -1)} to ${tochl} (ID: \`${tochl.id}\`).`,
        { ephemeral: true }
      );
    }

    if (!ctx.options.from) {
      // no from chosen, move all from the executer's current channel to selected "to" channel
      let tochl = guild.channels.cache.get(ctx.options.to);
      let fromchl = executer.voice.channel;

      if (!fromchl)
        return ctx.send(`You are not in a voice channel. Please use the full command or join a voice channel.`, {
          ephemeral: true
        });

      let numU = 0;
      fromchl.members.forEach((m) => {
        m.voice.setChannel(tochl);
        numU++;
      });

      return ctx.send(
        `Moved **${numU}** user(s) from ${fromchl} (ID: \`${fromchl.id}\`) to ${tochl} (ID: \`${tochl.id}\`).`,
        { ephemeral: true }
      );
    }
    if (!ctx.options.to) {
      // no to chosen, move all to the exectuer's current channel from selected "from" channel
      let fromchl = guild.channels.cache.get(ctx.options.from);
      let tochl = executer.voice.channel;

      if (!tochl)
        return ctx.send('You are not in a voice channel. Please user the full command or join a voice channel.', {
          ephemeral: true
        });

      let numU = 0;
      fromchl.members.forEach((m) => {
        m.voice.setChannel(tochl);
        numU++;
      });

      return ctx.send(
        `Moved **${numU}** user(s) from ${fromchl} (ID: \`${fromchl.id}\`) to ${tochl} (ID: \`${tochl.id}\`).`,
        { ephemeral: true }
      );
    }

    // both are chosen
    let tochl = guild.channels.cache.get(ctx.options.to);
    let fromchl = guild.channels.cache.get(ctx.options.from);

    let numU = 0;
    fromchl.members.forEach((m) => {
      m.voice.setChannel(tochl);
      numU++;
    });

    return ctx.send(
      `Moved **${numU}** user(s) from ${fromchl} (ID: \`${fromchl.id}\`) to ${tochl} (ID: \`${tochl.id}\`).`,
      { ephemeral: true }
    );
  }

  static name = 'moveall';
  static perm = 'MOVE_MEMBERS';
  static description = 'A command to move large quantites of users across voice channels';
};
