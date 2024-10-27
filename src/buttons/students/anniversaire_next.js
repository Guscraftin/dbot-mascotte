const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { Members } = require("../../dbObjects");
const { Op } = require("sequelize");

/**
 * Come from src/commands/students/anniversaire.js
 * And src/buttons/students/anniversaire_next.js and src/buttons/students/anniversaire_previous.js
 */

module.exports = {
  data: {
    name: "anniversaire_next",
  },
  async execute(interaction) {
    // Get information about the last embed
    const oldEmbed = interaction.message.embeds[0];
    const currentPage = parseInt(
      oldEmbed.footer.text.split(" ")[1].split("/")[0]
    );
    const pageCount = parseInt(
      oldEmbed.footer.text.split(" ")[1].split("/")[1]
    );

    // Recovering constants
    const pageSize = 10;
    const members = await Members.findAll({
      where: { date_birthday: { [Op.not]: null } },
    });
    const actualYear = new Date().getFullYear();

    // Order the members list by next birthdays
    await members.sort((a, b) => {
      const nextBirthdayA = new Date(
        actualYear,
        a.date_birthday.getMonth(),
        a.date_birthday.getDate()
      );
      if (nextBirthdayA < new Date().setHours(23, 59, 59, 999))
        nextBirthdayA.setFullYear(actualYear + 1);
      const nextBirthdayB = new Date(
        actualYear,
        b.date_birthday.getMonth(),
        b.date_birthday.getDate()
      );
      if (nextBirthdayB < new Date().setHours(23, 59, 59, 999))
        nextBirthdayB.setFullYear(actualYear + 1);
      return nextBirthdayA - nextBirthdayB;
    });

    // Displaying the next page of the birthday list
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * pageSize;
    const endIndex = nextPage * pageSize;
    const birthdayPage = members.slice(startIndex, endIndex);

    // Display the list of birthdays
    let embed = new EmbedBuilder()
      .setTitle(oldEmbed.title)
      .setDescription(
        birthdayPage
          .map((user) => {
            const nextBirthday = new Date(
              actualYear,
              user.date_birthday.getMonth(),
              user.date_birthday.getDate()
            );
            if (nextBirthday < new Date())
              nextBirthday.setFullYear(actualYear + 1);
            return `<t:${parseInt(nextBirthday / 1000)}:D> ▸ <@${user.id}> (\`${
              nextBirthday.getFullYear() - user.date_birthday.getFullYear() - 1
            } ans\`)`;
          })
          .join("\n")
      )
      .setColor(oldEmbed.color)
      .setFooter({ text: `Page ${nextPage}/${pageCount}` });

    // Displaying the navigation buttons
    const navigationRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("anniversaire_previous")
        .setLabel("◀️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(nextPage === 1),
      new ButtonBuilder()
        .setCustomId("anniversaire_next")
        .setLabel("▶️")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(nextPage === pageCount)
    );

    return interaction.update({
      embeds: [embed],
      components: [navigationRow],
      ephemeral: true,
    });
  },
};
