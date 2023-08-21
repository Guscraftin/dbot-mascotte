module.exports = (sequelize, DataTypes) => {
    return sequelize.define("members", {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        date_birthday: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        channel_birthday: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        mute_time: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });
};
