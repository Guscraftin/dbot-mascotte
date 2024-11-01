module.exports = (sequelize, DataTypes) => {
  return sequelize.define("guilds", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    automatic_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    automatic_mention_idea_poll: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    blacklist_mention_idea_poll: {
      type: DataTypes.TEXT,
      defaultValue: "[]",
      allowNull: false,
      get() {
        const data = this.getDataValue("blacklist_mention_idea_poll");
        return data ? JSON.parse(data) : [];
      },
      set(value) {
        const data = value ? JSON.stringify(value) : "[]";
        this.setDataValue("blacklist_mention_idea_poll", data);
      },
    },
    mails_from_moodle: {
      type: DataTypes.ENUM,
      values: ["automatic", "test_mail", "desactivate"],
      defaultValue: "automatic",
      allowNull: false,
    },
    mails_from_other: {
      type: DataTypes.ENUM,
      values: ["test_mail", "desactivate"],
      defaultValue: "test_mail",
      allowNull: false,
    },
  });
};
