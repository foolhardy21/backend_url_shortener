'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("url_map", "deleted_at", {
      type: Sequelize.DataTypes.DATE,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("url_map", "deleted_at")
  }
};
