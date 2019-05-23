const categories = require('../utils/data/categories');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Categories', categories.categories);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Categories', null);
  },
};
