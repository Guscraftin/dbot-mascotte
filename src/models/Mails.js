module.exports = (sequelize, DataTypes) => {
  return sequelize.define("mails", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  });
};
