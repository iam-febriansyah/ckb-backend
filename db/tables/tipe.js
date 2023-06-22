module.exports = (sequelize, Sequelize) => {
    const tipe = sequelize.define(
        "tipe",
        {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            tipe_name: {
                type: Sequelize.STRING,
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

    return tipe;
};
