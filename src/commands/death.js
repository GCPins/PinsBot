const { SlashCommand, CommandOptionType, Command } = require('slash-create');
const {client, logger}  = require('../index.js');
const { PermissionsBitField } = require('discord.js');

const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = class DeathCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'death',
      description: 'Death save rolling/management.',
      guildIDs: ['660685280717701120'],
      options: [{
        type: CommandOptionType.SUB_COMMAND,
        name: 'roll',
        description: 'Roll a secret death save that is only visible to you.'
      }, {
        type: CommandOptionType.SUB_COMMAND,
        name: 'channel',
        description: 'Set/view the channel a copy of the roll should be sent to',
        options: [{
            type: CommandOptionType.CHANNEL,
            name: 'set',
            description: 'The channel to send a copy of a roll to'
        }]
      }],
    });
  }

  async run(ctx) {

    let guild = client.guilds.cache.get(ctx.guildID);
    let executer = await guild.members.fetch(ctx.member.id);

    let dc = await db.get(`${ctx.guildID}.deathc`);

    if (ctx.options.roll) {

        let prev;

        let rNum = Math.floor(Math.random() * 20) + 1; // random num from 1..20
        let messg = `You rolled a **${rNum}**, which is a `;
        if (rNum == 1 || rNum == 20) messg += "**CRITICAL** ";
        rNum < 10 ? messg += "FAIL (womp womp).": messg += "SUCCESS!!!";

        if (dc) {
            let chl = guild.channels.cache.get(dc);
            chl.send(`${executer.nickname ? executer.nickname : executer.user.globalName} (User ID: \`${ctx.member.id}\`) JUST ROLLED A DEATH SAVE.\n__Result:__ *${messg}*`);
        }

        return ctx.send(messg, { ephemeral: true});
    }

    if (ctx.options.channel) {

        if (!executer.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return ctx.send("You cannot use this command, you do not have the **Administrator** permission.", { ephemeral: true });
        }

        if (ctx.options.channel.set) {
            await db.set(`${ctx.guildID}.deathc`, ctx.options.channel.set);
            return ctx.send(`You changed the channel to <#${ctx.options.channel.set}> (ID: \`${ctx.options.channel.set}\`)`, { ephemeral: true });
        }

        if (!dc) {
            return ctx.send(`There is no channel currently set.`, { ephemeral: true });
        }

        return ctx.send(`The current channel is <#${dc}> (ID: \`${dc}\`)`, { ephemeral: true });
    }

  }
}
