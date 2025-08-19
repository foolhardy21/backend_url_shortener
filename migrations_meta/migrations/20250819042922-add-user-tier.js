'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "tier", {
      type: Sequelize.DataTypes.ENUM("hobby", "enterprise"),
      defaultValue: "hobby",
      allowNull: false,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "tier")
  }
};
