module.exports = (sequelize, DataTypes) => {
    return sequelize.define("suggestions", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        embed_id: {
            type: DataTypes.STRING,
            defaultValue: "",
            allowNull: false,
        },
        files_id: {
            type: DataTypes.STRING,
        },
        is_answered: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    });
};