import * as fs from "fs";
import * as path from "path";

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import { clientId, guildId, token } from "../../config.json";

const rest = new REST({ version: "9" }).setToken(token);

const COMMANDS_PATH = path.resolve("src/commands");

const commands: any[] = [];
const commandFiles = fs.readdirSync(COMMANDS_PATH);

(async () => {
  // Pull command data from commnd files in commands folder
  for (const file of commandFiles) {
    const pkg = await import(`${COMMANDS_PATH}/${file}`);
    if (pkg.command) {
      console.log(`Found command: ${pkg.command.data.name}`);
      commands.push(pkg.command.data.toJSON());
    }
  }

  try {
    // Register commands
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
})();
