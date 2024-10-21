const { SlashCommand, CommandOptionType, Command } = require('slash-create');
const { client, logger } = require('../index.js');
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = class HelpCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'help',
      description: 'Shows the bot help menu',
      guildIDs: ['660685280717701120'],
      throttling: {
        usages: 2,
        duration: 3,
      },
      options: [{
        name: 'cmd',
        description: 'The command to get more info on',
        type: CommandOptionType.STRING
      }]
    });
  }

  async run(ctx) {

    let guild = client.guilds.cache.get(ctx.guildID);
    let executer = await guild.members.fetch(ctx.member.id);

    const cmdsPath = path.join(__dirname, '../commands');
    let props;

    if (ctx.options.cmd) {

      let choice = (ctx.options.cmd).toLowerCase();
      let str = "";

      if (!fs.existsSync(`${cmdsPath}/${choice}.js`)) {
        return ctx.send(`That command does not exist, or you do not have permission to use it - check your spelling and try again.`, { ephemeral: true });
      }

      props = require(`${cmdsPath}/${choice}.js`);

      if (props.perm) {
        if (!executer.permissions.has(props.perm)) {
          return ctx.send(`That command does not exist, or you do not have permission to use it - check your spelling and try again.`, { ephemeral: true });
        }
      }

      str += `**NAME:** \`${props.name}\`\n`;
      str += `**DESCRIPTION:** *${props.description}*`;

      return ctx.send(`The help command result for your selected cmd is below:\n\n${str}`, { ephemeral: true });
    }

    const cmdFiles = fs.readdirSync(cmdsPath).filter(f => f.endsWith('.js'));

    if (cmdFiles.length == 0) {
      return ctx.send("No commands loaded, not a single one exists!\n\nNow how did this happen?", { ephemeral: true });
    }

    let str = "";
    let temp;

    cmdFiles.forEach((f) => {
      console.log(f);
      let props = require(`./${f}`);
      if (!props.perm) {
        str += `\`${props.name}\` `
      } else {
        if (executer.permissions.has(props.perm)) {
          str += `\`${props.name}\` `;
        }
      }
    })

    return ctx.send(`The command you can use are:\n\n${str}`, {ephemeral: true});
    //return ctx.send("Under construction...", { ephemeral: true });

  }

  static name = "help";
  static perm = "";
  static description = "A simple command to display the help menu";
}
