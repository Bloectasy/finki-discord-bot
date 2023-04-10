import { client } from './client.js';
import { getFromBotConfig } from './config.js';
import { logger } from './logger.js';
import {
  type ActionRowBuilder,
  type ButtonBuilder,
  type Channel,
  type EmbedBuilder,
  type GuildTextBasedChannel,
  type Interaction,
  type InteractionResponse,
  type Message,
} from 'discord.js';

const channels: { [K in Channels]?: Channel | undefined } = {};

export const initializeChannels = () => {
  const channelIds = getFromBotConfig('channels');

  if (channelIds === undefined) {
    return;
  }

  channels.commands = client.channels.cache.get(channelIds.commands);
  channels.vip = client.channels.cache.get(channelIds.vip);
  channels.polls = client.channels.cache.get(channelIds.polls);
  channels.oath = client.channels.cache.get(channelIds.oath);

  logger.info('Channels initialized');
};

export const getChannel = (type: Channels) => channels[type];

export const log = async (
  embed: EmbedBuilder,
  interaction: Interaction,
  type: Channels,
) => {
  const channel = channels[type];

  if (channel === undefined || !channel.isTextBased()) {
    return;
  }

  try {
    await channel.send({ embeds: [embed] });
  } catch (error) {
    logger.error(
      `Failed to send log for interaction ${interaction.id}\n${error}`,
    );
  }
};

export const sendEmbed = async (
  channel: GuildTextBasedChannel,
  embed: EmbedBuilder,
  components: Array<ActionRowBuilder<ButtonBuilder>>,
  newlines?: number,
) => {
  return newlines === undefined || Number.isNaN(newlines)
    ? await channel.send({
        components,
        embeds: [embed],
      })
    : await channel.send({
        components,
        content: '_ _\n'.repeat(newlines),
        embeds: [embed],
      });
};

export const deleteResponse = (
  message: InteractionResponse | Message,
  interval?: number,
) => {
  setTimeout(
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async () => {
      try {
        await message.delete();
      } catch (error) {
        logger.error(`Failed to delete message ${message.id}\n${error}`);
      }
    },
    interval ?? getFromBotConfig('ephemeralReplyTime'),
  );
};
