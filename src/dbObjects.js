const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite",
});

const Guilds = require("./models/Guilds.js")(sequelize, Sequelize.DataTypes);
const Mails = require("./models/Mails.js")(sequelize, Sequelize.DataTypes);
const Members = require("./models/Members.js")(sequelize, Sequelize.DataTypes);
const Suggestions = require("./models/Suggestions.js")(sequelize, Sequelize.DataTypes);
const Tickets = require("./models/Tickets.js")(sequelize, Sequelize.DataTypes);

module.exports = { Guilds, Mails, Members, Suggestions, Tickets, sequelize };