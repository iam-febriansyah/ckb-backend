const dotenv = require("dotenv");
dotenv.config();
const { Sequelize, QueryTypes, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DATABASE_MYSQL,
    process.env.USER_MYSQL,
    process.env.PASSWORD_MYSQL,
    {
        host: process.env.HOST_MYSQL,
        dialect: "mysql",
        operatorsAliases: 0,
        logging: false,
        port: process.env.PORT_MYSQL,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
            connectTimeout: 20000,
        },
        dialectOptions: {
            // useUTC: false,
            timezone: "+07:00",
            dateStrings: true,
            typeCast: function (field, next) {
                // for reading from database
                if (field.type === "DATETIME") {
                    return field.string();
                }
                return next();
            },
        },
        timezone: "+07:00",
    }
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.name = process.env.DATABASE_MYSQL;

db.transaction = require("./tables/transaction")(
    sequelize,
    Sequelize,
    DataTypes
);

db.barang = require("./tables/barang")(sequelize, Sequelize, DataTypes);
db.lokasi = require("./tables/lokasi")(sequelize, Sequelize, DataTypes);
db.tipe = require("./tables/tipe")(sequelize, Sequelize, DataTypes);

module.exports = db;
