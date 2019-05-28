const todos = require('../utils/data/todos');

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Todos', todos.todos);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Todos', null);
  },
};
