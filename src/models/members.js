module.exports = (sequelize, DataTypes) => {
    return sequelize.define("members", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        mute_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });
};