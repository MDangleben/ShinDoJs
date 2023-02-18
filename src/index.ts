import * as fs from 'fs';
import * as path from 'path';

import { Client, Collection, Intents } from 'discord.js';

import { token } from '../config.json';

const COMMANDS_PATH = path.resolve(__dirname, './commands');
const EVENTS_PATH = path.resolve(__dirname, './events');

console.log('Initializing...');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

// Initialize commands
const commandFiles = fs.readdirSync(COMMANDS_PATH);

(async () => {
  for (const file of commandFiles) {
    const { command } = await import(`${COMMANDS_PATH}/${file}`);
    if (command) {
      client.commands.set(command.data.name, command);
    }
  }
})();

// Initialize events
const eventFiles = fs
  .readdirSync(EVENTS_PATH)
  .filter((file) => file.endsWith('.ts'));

(async () => {
  for (const file of eventFiles) {
    const { event } = await import(`${EVENTS_PATH}/${file}`);
    if (event) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }
  }
})();

client.login(token);
