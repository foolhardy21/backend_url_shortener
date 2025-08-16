'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("url_map", "user_id", {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
    })
    await queryInterface.addConstraint("url_map", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_url_user_id",
      references: {
        table: "users",
        field: "id",
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("url_map", "fk_url_user_id")
    await queryInterface.removeColumn("url_map", "user_id")
  }
};
