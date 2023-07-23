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
    });
};