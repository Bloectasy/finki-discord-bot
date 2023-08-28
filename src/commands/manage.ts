import { createAnto, createAntos, deleteAnto } from "../data/Anto.js";
import { createInfoMessage, getInfoMessage } from "../data/InfoMessage.js";
import { createLink, deleteLink, getLink, updateLink } from "../data/Link.js";
import {
  createQuestion,
  deleteQuestion,
  getQuestion,
  updateQuestion,
} from "../data/Question.js";
import {
  createQuestionLinks,
  deleteQuestionLinksByQuestionId,
} from "../data/QuestionLink.js";
import { createRule, deleteRule } from "../data/Rule.js";
import { AntosSchema } from "../schemas/AntosSchema.js";
import { LinksSchema } from "../schemas/LinksSchema.js";
import {
  getLinkComponents,
  getLinkEmbed,
  getQuestionComponents,
  getQuestionEmbed,
} from "../utils/components.js";
import { logger } from "../utils/logger.js";
import { commandDescriptions } from "../utils/strings.js";
import { InfoMessageType } from "@prisma/client";
import {
  type ChatInputCommandInteraction,
  codeBlock,
  SlashCommandBuilder,
} from "discord.js";

const name = "manage";

export const data = new SlashCommandBuilder()
  .setName(name)
  .setDescription("Менаџирај")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("question-set")
      .setDescription(commandDescriptions["manage question-set"])
      .addStringOption((option) =>
        option
          .setName("question")
          .setDescription("Прашање")
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption((option) =>
        option.setName("answer").setDescription("Одговор").setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("links")
          .setDescription("Линкови во JSON формат")
          .setRequired(false)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("question-delete")
      .setDescription(commandDescriptions["manage question-delete"])
      .addStringOption((option) =>
        option
          .setName("question")
          .setDescription("Прашање")
          .setRequired(true)
          .setAutocomplete(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("question-content")
      .setDescription(commandDescriptions["manage question-content"])
      .addStringOption((option) =>
        option
          .setName("question")
          .setDescription("Прашање")
          .setRequired(true)
          .setAutocomplete(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("link-set")
      .setDescription(commandDescriptions["manage link-set"])
      .addStringOption((option) =>
        option
          .setName("link")
          .setDescription("Име на линк")
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption((option) =>
        option.setName("url").setDescription("Линк до ресурс").setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("description").setDescription("Опис").setRequired(false)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("link-delete")
      .setDescription(commandDescriptions["manage link-delete"])
      .addStringOption((option) =>
        option
          .setName("link")
          .setDescription("Линк")
          .setRequired(true)
          .setAutocomplete(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("link-content")
      .setDescription(commandDescriptions["manage link-content"])
      .addStringOption((option) =>
        option
          .setName("link")
          .setDescription("Линк")
          .setRequired(true)
          .setAutocomplete(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("anto-add")
      .setDescription(commandDescriptions["manage anto-add"])
      .addStringOption((option) =>
        option.setName("anto").setDescription("Анто").setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("anto-delete")
      .setDescription(commandDescriptions["manage anto-delete"])
      .addStringOption((option) =>
        option.setName("anto").setDescription("Анто").setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("anto-mass-add")
      .setDescription(commandDescriptions["manage anto-mass-add"])
      .addStringOption((option) =>
        option
          .setName("antos")
          .setDescription("Анто-и во JSON формат")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("rule-set")
      .setDescription(commandDescriptions["manage rule-set"])
      .addStringOption((option) =>
        option.setName("rule").setDescription("Правило").setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("rule-delete")
      .setDescription(commandDescriptions["manage rule-delete"])
      .addStringOption((option) =>
        option
          .setName("rule")
          .setDescription("Правило")
          .setRequired(true)
          .setAutocomplete(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("infomessage-set")
      .setDescription(commandDescriptions["manage infomessage-set"])
      .addNumberOption((option) =>
        option
          .setName("index")
          .setDescription("Број на порака")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("type")
          .setDescription("Тип на порака")
          .setRequired(true)
          .setChoices(
            {
              name: "Текст",
              value: "text",
            },
            {
              name: "Слика",
              value: "image",
            }
          )
      )
      .addStringOption((option) =>
        option
          .setName("content")
          .setDescription("Содржина (текст или линк до слика)")
          .setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("infomessage-delete")
      .setDescription(commandDescriptions["manage infomessage-delete"])
      .addNumberOption((option) =>
        option
          .setName("index")
          .setDescription("Број на порака")
          .setRequired(true)
      )
  );

const handleManageQuestionSet = async (
  interaction: ChatInputCommandInteraction
) => {
  const keyword = interaction.options.getString("question", true);
  const answer = interaction.options
    .getString("answer", true)
    .replaceAll("\\n", "\n");
  const links = interaction.options.getString("links");
  const question = await getQuestion(keyword);
  let parsedLinks;

  if (links !== null) {
    try {
      parsedLinks = LinksSchema.parse(JSON.parse(links));
    } catch {
      await interaction.editReply("Линковите не се во валиден JSON формат.");
      return;
    }
  }

  if (question === null) {
    const newQuestion = {
      content: answer,
      ...(links !== null && {
        links: {
          createMany: {
            data: Object.entries(parsedLinks as Record<string, string>).map(
              ([linkName, linkUrl]) => ({
                name: linkName,
                url: linkUrl,
              })
            ),
          },
        },
      }),
      name: keyword,
      userId: interaction.user.id,
    };

    const createdQuestion = await createQuestion(newQuestion);

    if (createdQuestion === null) {
      await interaction.editReply(
        "Креирањето на прашањето беше неуспешно. Проверете дали е креирано."
      );
      return;
    }

    try {
      const questionEmbed = await getQuestionEmbed(createdQuestion);
      const questionComponents = getQuestionComponents(createdQuestion);
      await interaction.editReply({
        components: questionComponents,
        embeds: [questionEmbed],
      });
    } catch (error) {
      logger.error(`Failed sending a question\n${error}`);
      await interaction.editReply(
        "Креирањето на прашањето беше неуспешно. Проверете дали е креирано."
      );
    }

    return;
  }

  question.content = answer;
  await updateQuestion(question);

  if (links !== null) {
    try {
      LinksSchema.parse(JSON.parse(links));
    } catch (error) {
      logger.error(`Failed parsing links\n${error}`);
      await interaction.editReply("Линковите не се во валиден JSON формат.");
      return;
    }

    await deleteQuestionLinksByQuestionId(question.id);
    await createQuestionLinks(
      Object.entries(parsedLinks as Record<string, string>).map(
        ([linkName, linkUrl]) => ({
          name: linkName,
          questionId: question.id,
          url: linkUrl,
        })
      )
    );
  }

  const updatedQuestion = await getQuestion(keyword);

  if (updatedQuestion === null) {
    await interaction.editReply(
      "Креирањето на прашањето беше неуспешно. Проверете дали е креирано."
    );
    return;
  }

  try {
    const embed = await getQuestionEmbed(updatedQuestion);
    const components = getQuestionComponents(updatedQuestion);
    await interaction.editReply({
      components,
      embeds: [embed],
    });
  } catch (error) {
    logger.error(`Failed sending a question\n${error}`);
    await interaction.editReply(
      "Креирањето на прашањето беше неуспешно. Проверете дали е креирано."
    );
  }
};

const handleManageQuestionDelete = async (
  interaction: ChatInputCommandInteraction
) => {
  const keyword = interaction.options.getString("question", true);
  const question = await getQuestion(keyword);

  if (question === null) {
    await interaction.editReply("Не постои такво прашање.");
    return;
  }

  await deleteQuestion(keyword);
  await interaction.editReply("Прашањето е избришано.");
};

const handleManageQuestionContent = async (
  interaction: ChatInputCommandInteraction
) => {
  const keyword = interaction.options.getString("question", true);
  const question = await getQuestion(keyword);

  if (question === null) {
    await interaction.editReply("Не постои такво прашање.");
    return;
  }

  await interaction.editReply(
    "Име:" +
      codeBlock(question.name) +
      "\nОдговор:" +
      codeBlock(question.content.replaceAll("\n", "\\n")) +
      "\nЛинкови:" +
      codeBlock(
        JSON.stringify(
          question.links
            .map(({ name: linkName, url }) => ({
              [linkName]: url,
            }))
            // eslint-disable-next-line unicorn/no-array-reduce
            .reduce<Record<string, string>>(
              (accumulator, currentValue) => ({
                ...accumulator,
                ...currentValue,
              }),
              {}
            ),
          null,
          2
        )
      )
  );
};

const handleManageLinkSet = async (
  interaction: ChatInputCommandInteraction
) => {
  const keyword = interaction.options.getString("link", true);
  const description = interaction.options
    .getString("description")
    ?.replaceAll("\\n", "\n");
  const url = interaction.options.getString("url", true);
  const link = await getLink(keyword);

  if (!/https?:\/\/\S+\.\S+/u.test(url)) {
    await interaction.editReply("Линкот не е валиден.");
    return;
  }

  if (link === null) {
    const newLink = {
      description: description ?? null,
      name: keyword,
      url,
    };

    const createdLink = await createLink(newLink);

    if (createdLink === null) {
      await interaction.editReply(
        "Креирањето на линкот беше неуспешно. Проверете дали е креиран."
      );
      return;
    }

    try {
      const linkEmbed = await getLinkEmbed(createdLink);
      const linkComponents = getLinkComponents(createdLink);
      await interaction.editReply({
        components: linkComponents,
        embeds: [linkEmbed],
      });
    } catch (error) {
      logger.error(`Failed sending a link\n${error}`);
      await interaction.editReply(
        "Креирањето на линкот беше неуспешно. Проверете дали е креиран."
      );
    }

    return;
  }

  link.url = url;
  if (description !== undefined) {
    link.description = description;
  }

  await updateLink(link);

  const updatedLink = await getLink(keyword);

  if (updatedLink === null) {
    await interaction.editReply(
      "Креирањето на линкот беше неуспешно. Проверете дали е креиран."
    );
    return;
  }

  try {
    const embed = await getLinkEmbed(updatedLink);
    const components = getLinkComponents(updatedLink);
    await interaction.editReply({
      components,
      embeds: [embed],
    });
  } catch (error) {
    logger.error(`Failed sending a link\n${error}`);
    await interaction.editReply(
      "Креирањето на линкот беше неуспешно. Проверете дали е креиран."
    );
  }
};

const handleManageLinkDelete = async (
  interaction: ChatInputCommandInteraction
) => {
  const keyword = interaction.options.getString("link", true);
  const link = await getLink(keyword);

  if (link === null) {
    await interaction.editReply("Не постои таков линк.");
    return;
  }

  await deleteLink(keyword);
  await interaction.editReply("Линкот е избришан.");
};

const handleManageLinkContent = async (
  interaction: ChatInputCommandInteraction
) => {
  const keyword = interaction.options.getString("link", true);
  const link = await getLink(keyword);

  if (link === null) {
    await interaction.editReply("Не постои такво прашање.");
    return;
  }

  await interaction.editReply(
    "Име:" +
      codeBlock(link.name) +
      "\nОпис:" +
      codeBlock(link.description?.replaceAll("\n", "\\n") ?? "-") +
      "\nЛинк:" +
      codeBlock(link.url)
  );
};

const handleManageAntoAdd = async (
  interaction: ChatInputCommandInteraction
) => {
  const anto = interaction.options.getString("anto", true);
  const createdAnto = await createAnto({
    quote: anto,
    userId: interaction.user.id,
  });

  if (createdAnto === null) {
    await interaction.editReply(
      "Креирањето на Анто фактот беше неуспешно. Проверете дали е креирано."
    );
    return;
  }

  await interaction.editReply(createdAnto.quote);
};

const handleManageAntoDelete = async (
  interaction: ChatInputCommandInteraction
) => {
  const anto = interaction.options.getString("anto", true);
  const deletedAnto = await deleteAnto(anto);

  if (deletedAnto === null) {
    await interaction.editReply("Не постои таков Анто факт.");
    return;
  }

  await interaction.editReply("Анто фактот е избришан.");
};

const handleManageAntoMassAdd = async (
  interaction: ChatInputCommandInteraction
) => {
  const antos = interaction.options.getString("antos", true);
  let parsedAntos;

  try {
    parsedAntos = AntosSchema.parse(JSON.parse(antos));
  } catch (error) {
    logger.error(`Failed parsing antos\n${error}`);
    await interaction.editReply("Анто фактите не се во валиден JSON формат.");
    return;
  }

  const createdAntos = await createAntos(
    parsedAntos.map((anto) => ({
      quote: anto,
      userId: interaction.user.id,
    }))
  );

  if (createdAntos === null) {
    await interaction.editReply(
      "Креирањето на Анто фактите беше неуспешно. Проверете дали се креирани."
    );
    return;
  }

  await interaction.editReply("Успешно се креирани сите Анто факти.");
};

const handleManageRuleSet = async (
  interaction: ChatInputCommandInteraction
) => {
  const rule = interaction.options.getString("rule", true);

  await createRule({
    rule,
    userId: interaction.user.id,
  });

  await interaction.editReply("Правилото е креирано.");
};

const handleManageRuleDelete = async (
  interaction: ChatInputCommandInteraction
) => {
  const rule = interaction.options.getString("rule", true);

  await deleteRule(rule);

  await interaction.editReply("Правилото е избришано.");
};

const handleMangeInfoMessageSet = async (
  interaction: ChatInputCommandInteraction
) => {
  const index = interaction.options.getNumber("index", true);
  const type = interaction.options.getString("type", true);
  const content = interaction.options
    .getString("content", true)
    .replaceAll("\\n", "\n");
  const infoMessage = await getInfoMessage(index);

  if (infoMessage === null) {
    await createInfoMessage({
      content,
      index,
      type: type === "text" ? InfoMessageType.TEXT : InfoMessageType.IMAGE,
      userId: interaction.user.id,
    });
  }

  await interaction.editReply("Инфо пораката е поставена.");
};

const handleManageInfoMessageDelete = async (
  interaction: ChatInputCommandInteraction
) => {
  const index = interaction.options.getNumber("index", true);

  const infoMessage = await getInfoMessage(index);

  if (infoMessage === null) {
    await interaction.editReply("Не постои таква инфо порака.");
    return;
  }

  await interaction.editReply("Инфо пораката е избришана.");
};

const manageHandlers = {
  "anto-add": handleManageAntoAdd,
  "anto-delete": handleManageAntoDelete,
  "anto-mass-add": handleManageAntoMassAdd,
  "infomessage-delete": handleManageInfoMessageDelete,
  "infomessage-set": handleMangeInfoMessageSet,
  "link-content": handleManageLinkContent,
  "link-delete": handleManageLinkDelete,
  "link-set": handleManageLinkSet,
  "question-content": handleManageQuestionContent,
  "question-delete": handleManageQuestionDelete,
  "question-set": handleManageQuestionSet,
  "rule-delete": handleManageRuleDelete,
  "rule-set": handleManageRuleSet,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const subcommand = interaction.options.getSubcommand(true);

  if (Object.keys(manageHandlers).includes(subcommand)) {
    await manageHandlers[subcommand as keyof typeof manageHandlers](
      interaction
    );
  }
};
