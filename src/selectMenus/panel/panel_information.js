const {
  infoFirstEmbed,
  infoSecondEmbed,
  infoThirdEmbed,
  infoFourthEmbed,
  infoFifthEmbed,
  infoSixthEmbed,
  infoSeventhEmbed,
  infoEighthEmbed,
  infoEighthEmbed2,
  infoNinthEmbed,
  infoSelectMenu,
} = require("../../commands/admin/panel.js");

module.exports = {
  data: {
    name: "panel_information",
  },
  async execute(interaction) {
    switch (interaction.values[0]) {
      case "info1":
        return interaction.reply({
          embeds: [infoFirstEmbed],
          components: [infoSelectMenu],
          ephemeral: true,
        });

      case "info2":
        return interaction.reply({
          embeds: [infoSecondEmbed],
          components: [infoSelectMenu],
          ephemeral: true,
        });

      case "info3":
        return interaction.reply({
          embeds: [infoThirdEmbed],
          components: [infoSelectMenu],
          ephemeral: true,
        });

      case "info4":
        return interaction.reply({
          embeds: [infoFourthEmbed],
          components: [infoSelectMenu],
          ephemeral: true,
        });

      case "info5":
        return interaction.reply({
          embeds: [infoFifthEmbed],
          components: [infoSelectMenu],
          ephemeral: true,
        });

      case "info6":
        return interaction.reply({
          embeds: [infoSixthEmbed],
          components: [infoSelectMenu],
          ephemeral: true,
        });

      case "info7":
        return interaction.reply({
          embeds: [infoSeventhEmbed],
          components: [infoSelectMenu],
          ephemeral: true,
        });

      case "info8":
        return interaction.reply({
          embeds: [infoEighthEmbed, infoEighthEmbed2],
          components: [infoSelectMenu],
          ephemeral: true,
        });

      case "info9":
        return interaction.reply({
          embeds: [infoNinthEmbed],
          components: [infoSelectMenu],
          ephemeral: true,
        });

      /**
       * DEFAULT
       */
      default:
        return interaction.reply({
          content:
            "Une erreur s'est produite. Veuillez contacter un admin ou sélectionner une autre partie ci-dessous.",
          components: [infoSelectMenu],
          ephemeral: true,
        });
    }
  },
};
