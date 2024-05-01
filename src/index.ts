import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { token } from '../config.json';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

(async () => {
  // Register commands
  const commandFoldersPath = path.join(__dirname, './commands');
  const commandFolders = fs.readdirSync(commandFoldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(commandFoldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.ts'));

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const { command } = await import(filePath);

      if (command) {
        if ('data' in command && 'execute' in command) {
          console.log(`Setting command: ${command.data.name}`);
          client.commands.set(command.data.name, command);
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
          );
        }
      }
    }
  }

  // Register events
  const eventsPath = path.join(__dirname, './events');
  const eventFiles = fs.readdirSync(eventsPath);

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const { event } = await import(filePath);
    console.log(`Setting event ${event.name}`);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  client.login(token);
})();
