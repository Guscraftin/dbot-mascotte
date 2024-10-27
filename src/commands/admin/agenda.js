const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("agenda")
    .setDescription(
      "🔧 Permet de récupérer des informations sur un repo github."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName("group")
        .setDescription(
          "Recevoir l'emploi du temps dans ce salon tous les jours à 18h."
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    // Get the repo name
    const groupName = interaction.options.getString("group");

    // Get the repo information
    let groups = await fetch("https://zeus.ionis-it.com/api/group", {
      method: "GET",
      headers: {
        Authorization: process.env.ZEUS_TOKEN,
      },
    }).then((response) => response.json());
    // console.log(groups);
    // console.log(groups.length);

    let group = await groups.find((m) => m.name === groupName);
    // console.log(group);

    if (!group)
      return interaction.reply(
        "La classe est invalide ou introuvable (ex: S1S2 B2)"
      );

    const groupSearch = await fetch(
      `https://zeus.ionis-it.com/api/group/${group.id}/ics`,
      {
        method: "GET",
        headers: {
          Authorization: process.env.ZEUS_TOKEN,
        },
      }
    ).then((response) => response.text());
    console.log(groupSearch);

    // Return the message
    return interaction.reply(
      `L'emploi du temps de la classe **${group.name}** a été trouvé.`
    );

    // return interaction.reply({
    //     embeds: [{
    //         title: repoInfo.full_name,
    //         url: repoInfo.html_url,
    //         description: repoInfo.description,
    //         color: 0x2f3136,
    //         fields: [
    //             { name: "Créateur", value: repoInfo.owner.login, inline: true },
    //             { name: "Langage", value: repoInfo.language, inline: true },
    //             { name: "Forks", value: repoInfo.forks_count, inline: true },
    //             { name: "Stars", value: repoInfo.stargazers_count, inline: true },
    //             { name: "Issues", value: repoInfo.open_issues_count, inline: true },
    //             { name: "Taille", value: `${(repoInfo.size / 1000).toFixed(2)} Mo`, inline: true },
    //             { name: "Création", value: new Date(repoInfo.created_at).toLocaleDateString("fr-FR"), inline: true },
    //             { name: "Dernière mise à jour", value: new Date(repoInfo.updated_at).toLocaleDateString("fr-FR"), inline: true },

    //         ],
    //         thumbnail: { url: repoInfo.owner.avatar_url },
    //         footer: { text: "GitHub", icon_url: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" },
    //     }]
    // });
  },
};
