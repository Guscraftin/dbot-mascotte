const {
  role_mail_moodle,
  role_mail_news,
  role_mail_other,
  role_idea_poll,
  role_agenda,
  role_absence,
  role_help,
  role_discord,
} = require(process.env.CONSTANT);

module.exports = {
  data: {
    name: "panel_role_reaction",
  },
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const roleSelected = interaction.values;
    const testRoles = [
      role_mail_moodle,
      role_mail_news,
      role_mail_other,
      role_idea_poll,
      role_agenda,
      role_absence,
      role_help,
      role_discord,
    ];
    const listRemovedRoles = [];
    const listAddedRoles = [];

    async function updateRole(member, role, listAddedRoles, listRemovedRoles) {
      const hasRole = member.roles.cache.has(role);
      const isSelected = roleSelected.includes(role);

      if (isSelected && !hasRole) {
        await member.roles.add(role);
        listAddedRoles.push(role);
      } else if (!isSelected && hasRole) {
        await member.roles.remove(role);
        listRemovedRoles.push(role);
      }
    }

    for (const role of testRoles) {
      await updateRole(
        interaction.member,
        role,
        listAddedRoles,
        listRemovedRoles
      );
    }

    let content = ``;
    if (listAddedRoles.length > 0)
      content += `> J'ai bien **ajouté** les rôles suivants : ${listAddedRoles
        .map((role) => `<@&${role}>`)
        .join(", ")}\n`;
    if (listRemovedRoles.length > 0)
      content += `> J'ai bien **retiré** les rôles suivants : ${listRemovedRoles
        .map((role) => `<@&${role}>`)
        .join(", ")}\n`;

    const userRoles = await interaction.member.roles.cache
      .filter((role) => testRoles.includes(role.id))
      .map((role) => role.toString())
      .join(", ");
    if (userRoles)
      content += `**Tu possèdes désormais les rôles de notification suivants : ${userRoles}**`;
    else content += `**Tu n'as plus aucun rôle de notification.**`;

    return interaction.editReply({ content: `${content}` });
  },
};
