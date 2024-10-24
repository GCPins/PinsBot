const { SlashCommand, CommandOptionType } = require('slash-create');
const { client, logger } = require('../index.js');

const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = class JailCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'jail',
      description: 'Jail users and manage the jail role for this server',
      guildIDs: ['660685280717701120'],
      requiredPermissions: ['ADMINISTRATOR'],
      throttling: {
        usages: 2,
        duration: 5
      },
      options: [
        {
          name: 'role',
          description: 'View or change the jail role for this server',
          type: CommandOptionType.SUB_COMMAND_GROUP,
          options: [
            {
              name: 'view',
              description: 'View the jail role for this server',
              type: CommandOptionType.SUB_COMMAND
            },
            {
              name: 'set',
              description: 'Set the jail role for this server',
              type: CommandOptionType.SUB_COMMAND,
              options: [
                {
                  name: 'role',
                  description: 'The role to set as the jail role',
                  type: CommandOptionType.ROLE,
                  required: true
                }
              ]
            }
          ]
        },
        {
          name: 'user',
          description: 'Toss a user into jail',
          type: CommandOptionType.SUB_COMMAND,
          options: [
            {
              name: 'name',
              description: 'The user to jail',
              type: CommandOptionType.USER,
              required: true
            }
          ]
        },
        {
          name: 'force',
          description: 'Enable forced jailing of users',
          type: CommandOptionType.SUB_COMMAND,
          options: [
            {
              name: 'enabled',
              description: 'Whether to enable the force option or not',
              type: CommandOptionType.BOOLEAN
            }
          ]
        }
      ]
    });
  }

  async run(ctx) {
    let guild = client.guilds.cache.get(ctx.guildID);
    //return ctx.send('Under construction...', { ephemeral: true });

    let jailRole = await db.get(`${guild.id}.jr`);
    let forceEnabled = await db.get(`${guild.id}.fe`);

    if (ctx.options.force) {
      if (ctx.options.force.enabled == null) {
        return ctx.send(`The force option is currenty set to **${forceEnabled ? 'TRUE' : 'FALSE'}**.`, {
          ephemeral: true
        });
      }

      //if (ctx.options.force.enabled != null) {
      await db.set(`${guild.id}.fe`, ctx.options.force.enabled);
      forceEnabled = await db.get(`${guild.id}.fe`);
      return ctx.send(`Set the force option to **${forceEnabled}**.`, { ephemeral: true });
      //}
    }

    if (ctx.options.role) {
      if (ctx.options.role.view) {
        if (!jailRole) {
          return ctx.send(
            `No jail role has been configured for this server (set one with \`/jail role set role:ROLENAME\`).`,
            { ephemeral: true }
          );
        }

        //if (jailRole) {
        return ctx.send(`The jail role for this server is <@&${jailRole}> (ID: \`${jailRole}\`).`, { ephemeral: true });
        //}
      }

      if (ctx.options.role.set) {
        await db.set(`${guild.id}.jr`, ctx.options.role.set.role);
        jailRole = await db.get(`${guild.id}.jr`);

        return ctx.send(`The jail role has been set to <@&${jailRole}> (ID: \`${jailRole}\`).`, { ephemeral: true });
      }
    }

    if (ctx.options.user) {
      // IF CTX.OPTIONS.USER

      if (!jailRole) {
        return ctx.send(
          `Could not jail the user - no jail role has been configured for this server (\`/setjailrole role:ROLENAME\`).`,
          { ephemeral: true }
        );
      }

      let target = await guild.members.fetch(ctx.options.user.name);

      // else (jail role exists, proceed to jail user)
      if (target.roles.cache.has(jailRole) && !forceEnabled) {
        return ctx.send(
          `The user already has the jail role! To jail the user anyway, enable the "force" option (\`/jail force enabled:TRUE\`).`,
          { ephemeral: true }
        );
      }

      //let oldRoles = await db.get(`${guild.id}.${target.id}.cr`);
      //if (!oldRoles) oldRoles = []; // confiscated roles + fix for empty db
      let userRoles = target.roles.cache.map((r) => r.id);

      let jailRoles = [];
      /*
      oldRoles.forEach((r) => {
        if (userRoles.includes(r) && r != jailRole) {
          // dont add jail role
          // the user still has a role from the old roles db. add it to the roles to be preserved
          jailRoles.push(r); // should be just a role ID, should make this easier
        } // else, do not add it (effectively removing it once we set db)
      });
      */        //ONLY ADD THE ROLES THE USER CURRENTLY HAS!

      userRoles.forEach((r) => {
        if (r == jailRole) return; // don't add jail role to array might break stuff
        jailRoles.push(r);
      });

      //logger.warn('USER ROLES to save: ' + jailRoles);

      target.roles.set([jailRole])
      .then(async () => {
        await db.set(`${guild.id}.${target.id}.cr`, jailRoles); // !!! do I need to push once at a time??
        return await ctx.send(
          `Successfully jailed <@${target.id}> (ID: \`${
            target.id
          }\`) by assigning them with only the role <@&${jailRole}>.\n\n*You can free the user at any time (\`/free user:@${
            target.nickname ? target.nickname : target.displayName
          }\`).*`,
          { ephemeral: true }
        );
      })
      .catch(async (err) => {
        logger.warn("I don't have permission to do that.");
        return await ctx.send(
          `An error occured while removing the user's roles. I must have a role above their highest role for this command to work correctly.`,
          { ephemeral: true }
        );
      });
      /*
      db.set(`${guild.id}.${target.id}.cr`, jailRoles); // !!! do I need to push once at a time??
      logger.warn(await db.get(`${guild.id}.${target.id}.cr`));

      // jail time!!!
      return ctx.send(
        `Successfully jailed <@${target.id}> (ID: \`${
          target.id
        }\`) by assigning them with only the role <@&${jailRole}>.\n\n*You can free the user at any time with the command \`/free user:@${
          target.nickname ? target.nickname : target.displayName
        }\`*`,
        { ephemeral: true }
      );
      */
    }
  }

  //static name = "jail";
  //static perm = "ADMINISTRATOR";
  //static description = "Will jail the specified user and assign them a single \"quarantine\" role";
};
