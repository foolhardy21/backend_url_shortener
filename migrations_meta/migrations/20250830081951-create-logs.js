'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("logs", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      method: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      url: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      user_agent: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("logs")
  }
};
