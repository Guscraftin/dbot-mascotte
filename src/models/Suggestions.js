module.exports = (sequelize, DataTypes) => {
  return sequelize.define("suggestions", {
    author_id: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    message_id: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    is_answered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });
};
