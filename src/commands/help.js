const { SlashCommand, CommandOptionType } = require('slash-create');
const { client, cmdObjs } = require('../index.js');

module.exports = class HelpCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'help',
      description: 'Shows the bot help menu',
      guildIDs: ['660685280717701120'],
      throttling: {
        usages: 2,
        duration: 3
      },
      options: [
        {
          name: 'cmd',
          description: 'The command to get more info on',
          type: CommandOptionType.STRING,
          autocomplete: true //would allow use to provide "list" of available commands
        }
      ]
    });
  }

  async autocomplete(ctx) {
    let guild = client.guilds.cache.get(ctx.guildID);
    let executer = await guild.members.fetch(ctx.member.id);

    /*
    const cmdsPath = path.join(__dirname, '../commands');

    const cmdFiles = fs.readdirSync(cmdsPath).filter(f => f.endsWith('.js'));
    */

    let autoCmds = [];

    for (const c in cmdObjs) {
      if (!cmdObjs[c].perm) {
        autoCmds.push(c);
      } else {
        if (executer.permissions.has(cmdObjs[c].perm)) {
          autoCmds.push(c);
        }
      }
    }

    /*
    cmdsList.forEach((f) => {
      let props = require(`./${f}`);
      if (!props.perm) {
        autoCmds.push(props.name);
      } else {
        if (executer.permissions.has(props.perm)) {
          autoCmds.push(props.name);
        }
      }
    });
    */

    const filtered = autoCmds.filter((c) => c.startsWith(ctx.options.cmd));

    await ctx.sendResults(filtered.map((c) => ({ name: c, value: c })));
  }

  async run(ctx) {
    let guild = client.guilds.cache.get(ctx.guildID);
    let executer = await guild.members.fetch(ctx.member.id);

    //const cmdsPath = path.join(__dirname, '../commands');
    let props;

    if (ctx.options.cmd) {
      let choice = ctx.options.cmd.toLowerCase();
      let str = '';

      //if (!cmdsList.includes(`${choice}.js`)) {
      if (!cmdObjs[choice]) {
        return ctx.send(
          `That command does not exist, or you do not have permission to use it - check your spelling and try again.`,
          { ephemeral: true }
        );
      }

      //props = require(`./${choice}.js`);
      props = cmdObjs[choice];

      let permStr = '';
      if (props.perm) {
        if (!executer.permissions.has(props.perm)) {
          return ctx.send(
            `That command does not exist, or you do not have permission to use it - check your spelling and try again.`,
            { ephemeral: true }
          );
        }
        permStr += `\n**REQUIRED PERMISSION:** \`${props.perm}\``;
      }

      str += `**NAME:** \`${choice}\`\n`;
      str += `**DESCRIPTION:** *${props.description}*`;
      str += permStr;

      return ctx.send(`The help command result for your selected cmd is below:\n\n${str}`, { ephemeral: true });
    }

    //const cmdFiles = fs.readdirSync(cmdsPath).filter(f => f.endsWith('.js'));

    if (/*cmdsList.length == 0 || */ Object.keys(cmdObjs).length == 0) {
      return ctx.send('No commands loaded, not a single one exists!\n\nNow how did this happen?', { ephemeral: true });
    }

    let str = '';

    for (const c in cmdObjs) {
      if (!cmdObjs[c].perm) {
        str += `\`${c}\` `;
      } else {
        if (executer.permissions.has(cmdObjs[c].perm)) {
          str += `\`${c}\` `;
        }
      }
    }

    /*
    cmdsList.forEach((f) => {
      let props = require(`./${f}`);
      if (!props.perm) {
        str += `\`${props.name}\` `
      } else {
        if (executer.permissions.has(props.perm)) {
          str += `\`${props.name}\` `;
        }
      }
    })
      */

    return ctx.send(
      `The commands available for you to use are:\n\n${str}\n\n*To get more information about a specific command, use \`/help cmd:COMMANDNAME\`*`,
      { ephemeral: true }
    );
    //return ctx.send("Under construction...", { ephemeral: true });
  }

  static name = 'help';
  static perm = '';
  static description =
    'A simple command to display the help menu - includes a list of all commands and an option to view specific details for each command.';
};
