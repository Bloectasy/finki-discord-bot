import { getConfigProperty } from "../utils/config.js";
import { addExperience } from "../utils/experience.js";
import { logger } from "../utils/logger.js";
import { type ClientEvents, Events, type Message } from "discord.js";

export const name = Events.MessageCreate;
const crosspostChannels = await getConfigProperty("crosspostChannels");

const crosspost = async (message: Message) => {
  if (
    !(await getConfigProperty("crossposting")) ||
    crosspostChannels.length === 0 ||
    !crosspostChannels.includes(message.channel.id)
  ) {
    return;
  }

  try {
    await message.crosspost();
  } catch (error) {
    logger.error(
      `Failed to crosspost message by ${message.author.tag}\n${error}`
    );
  }
};

export const execute = async (...[message]: ClientEvents[typeof name]) => {
  await crosspost(message);
  await addExperience(message);
};
