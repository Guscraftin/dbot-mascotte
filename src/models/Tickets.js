module.exports = (sequelize, DataTypes) => {
  return sequelize.define("tickets", {
    user_id: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "opened",
      allowNull: false,
    },
    channel_id: {
      type: DataTypes.STRING,
    },
    message_id: {
      type: DataTypes.STRING,
    },
    message_url: {
      type: DataTypes.STRING,
    },
  });
};
