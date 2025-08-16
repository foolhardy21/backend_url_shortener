'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.DataTypes.TEXT,
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.TEXT,
      },
      api_key: {
        type: Sequelize.DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users")
  }
};
