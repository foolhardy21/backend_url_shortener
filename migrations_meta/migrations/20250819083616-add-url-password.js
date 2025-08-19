'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("url_map", "password", {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
    })
    await queryInterface.addConstraint("url_map", {
      fields: ["password"],
      type: "unique",
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("url_map", "password")
  }
};
