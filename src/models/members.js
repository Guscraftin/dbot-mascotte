module.exports = (sequelize, DataTypes) => {
    return sequelize.define("members", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        is_mute: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });
};