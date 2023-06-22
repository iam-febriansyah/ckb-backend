module.exports = (sequelize, Sequelize) => {
    const transactions = sequelize.define(
        "transactions",
        {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            kode_barang: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            kondisi: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lokasi: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            qty: {
                type: Sequelize.DOUBLE,
                allowNull: false,
            },
            created_at: {
                type: "TIMESTAMP",
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false,
            },
            created_by: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "system",
            },
            updated_at: {
                type: "TIMESTAMP",
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                allowNull: false,
            },
            updated_by: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "system",
            },
            is_deleted: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        },
        {
            timestamps: false,
        }
    );

    return transactions;
};
