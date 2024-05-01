import * as fs from 'fs';
import * as path from 'path';

import {
  REST,
  RESTPostAPIApplicationCommandsJSONBody,
  Routes,
} from 'discord.js';

import { token, clientId, guildId } from '../../config.json';

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

const commandFoldersPath = path.join(__dirname, '../commands');
const commandFolders = fs.readdirSync(commandFoldersPath);

const rest = new REST().setToken(token);

(async () => {
  // Iterate over files in command folders and build commands from applicable files
  for (const folder of commandFolders) {
    const commandsPath = path.join(commandFoldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.ts'));

    console.log(commandFiles);

    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const { command } = await import(filePath);

      if (command) {
        if ('data' in command && 'execute' in command) {
          commands.push(command.data.toJSON());
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
          );
        }
      }
    }
  }

  // Deploy commands
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    // Refresh all commands in target guild with loaded commands
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
