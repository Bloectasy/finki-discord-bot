import { getQuestion } from "../data/Question.js";
import {
  getQuestionComponents,
  getQuestionEmbed,
} from "../utils/components.js";
import { commandDescriptions } from "../utils/strings.js";
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

const name = "faq";

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription(commandDescriptions[name])
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("Прашање")
      .setRequired(true)
      .setAutocomplete(true)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const keyword = interaction.options.getString("question", true);
  const question = await getQuestion(keyword);

  if (question === null) {
    await interaction.editReply("Не постои такво прашање.");
    return;
  }

  const embed = await getQuestionEmbed(question);
  const components = getQuestionComponents(question);
  await interaction.editReply({
    components,
    embeds: [embed],
  });
};
