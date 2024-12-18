require('dotenv').config();
const { SlashCreator, GatewayServer } = require('slash-create');
const path = require('path');
const CatLoggr = require('cat-loggr');
const logger = new CatLoggr().setLevel(process.env.COMMANDS_DEBUG === 'true' ? 'debug' : 'info');
const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildVoiceStates
  ]
});
const { QuickDB } = require('quick.db');
const db = new QuickDB();

// populate cmdsList with list of commands
const cmdsPath = path.join(__dirname, './commands');
const cmdFiles = fs.readdirSync(cmdsPath).filter((f) => f.endsWith('.js'));

const cmdObjs = {};
const cmdsList = [];
cmdFiles.forEach(async (f) => {
  const curCmd = await import(`./commands/${f}`);
  let props = new curCmd.default();
  //logger.warn(props);
  cmdObjs[props.commandName] = {
    perm: props.requiredPermissions ? props.requiredPermissions[0] : '',
    description: props.description
  };

  //cmdsList.push(f);
});

module.exports = { client, logger, cmdsList, cmdObjs };

const creator = new SlashCreator({
  applicationID: process.env.DISCORD_APP_ID,
  publicKey: process.env.DISCORD_PUBLIC_KEY,
  token: process.env.DISCORD_BOT_TOKEN,
  serverPort: parseInt(process.env.PORT, 10) || 8020,
  serverHost: '0.0.0.0'
});

creator.on('debug', (message) => logger.log(message));
creator.on('warn', (message) => logger.warn(message));
creator.on('error', (error) => logger.error(error));
creator.on('synced', () => logger.info('Commands synced!'));
creator.on('commandRun', (command, _, ctx) =>
  logger.info(`${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command ${command.commandName}`)
);
creator.on('commandRegister', (command) => logger.info(`Registered command ${command.commandName}`));
creator.on('commandError', (command, error) => logger.error(`Command ${command.commandName}:`, error));

creator
  .withServer(new GatewayServer((handler) => client.ws.on('INTERACTION_CREATE', handler)))
  .registerCommandsIn(path.join(__dirname, 'commands'))
  .syncCommands();

console.log(`Starting server at "localhost:${creator.options.serverPort}/interactions"`);

client.on('ready', () => {
  logger.info(`Logged in as: ${client.user.tag}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
