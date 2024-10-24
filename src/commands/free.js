const { SlashCommand, CommandOptionType } = require('slash-create');
const { client, logger } = require('../index.js');

const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = class FreeCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'free',
      description: 'Free a user from jail',
      guildIDs: ['660685280717701120'],
      throttling: {
        usages: 1,
        duration: 5
      },
      options: [
        {
          name: 'user',
          description: 'The user to set free',
          type: CommandOptionType.USER,
          required: true
        }
      ],
      requiredPermissions: ["ADMINISTRATOR"]
    });
  }

  async run(ctx) {
    let guild = client.guilds.cache.get(ctx.guildID);

    let jailRole = await db.get(`${guild.id}.jr`);
    let forceEnabled = await db.get(`${guild.id}.fe`);

    let target = await guild.members.fetch(ctx.options.user);

    if (!jailRole) {
      return ctx.send(`No jail role has been configured for this server (use \`/jail role set role:ROLENAME\` to set one).`, { ephemeral: true });
    }

    if (!target.roles.cache.has(jailRole) && !forceEnabled) {
      return ctx.send(`Could not free the selected user because they do not have the jail role. To bypass this, enable the force option for jail/free commands (\`/jail force enabled:True\`).`, { ephemeral: true });
    }

    // jailRole is configured and user has role or force is enabled

    let jailRoles = await db.get(`${guild.id}.${target.id}.cr`);

    target.roles.set(jailRoles)
      .then(async () => {
        return await ctx.send(`Freed <@${target.id}> (ID: \`${target.id}\`) from their shackles.\n\n*You can send them back to jail at any time (\`/jail user name:@${target.nickname ? target.nickname : target.displayName}\`).*`, { ephemeral: true });
      })
      .catch(async (err) => {
      logger.warn("I don't have permission to do that - ERR:\n" + err);
      return await ctx.send(
        `An error occured while removing the user's roles. I must have a role above their highest role for this command to work correctly.`,
        { ephemeral: true }
      );
    });

    //return ctx.send(`Freed <@${target.id}> (ID: \`${target.id}\`) from their shackles.\n\nYou can send them back to jail at any time (\`/jail user name:@${target.nickname ? target.nickname : target.displayName}\`).`, { ephemeral: true });
  }
};
