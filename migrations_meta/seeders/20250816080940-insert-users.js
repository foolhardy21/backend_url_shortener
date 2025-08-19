'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        name: "Vinay Kumar",
        email: "vinay.kumar@gmail.com",
        api_key: "3f9f1e69-8b74-4c4d-9b91-2a2f1a7f37e2",
      },
      {
        name: "Smriti",
        email: "smriti@gmail.com",
        api_key: "a6d7e0b2-0b3e-446d-8f7c-4a3d06ad0c8f",
      },
      {
        name: "Chetna",
        email: "chetna@gmail.com",
        api_key: "eed9a18a-f7c6-4a48-bd7a-297681c54191",
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {})
  }
};
