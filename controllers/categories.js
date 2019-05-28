const Category = require('../server/models/index').Categories;

module.exports = {

  /**
   * @function getAllCategories
   * @param {Object} req
   * @param {Object} res
   * @return Status Code & Object with array
   */
  getAllCategories(req, res) {

    Category.findAll()
      .then(categories => res.status(200).send({
        success: 'true',
        message: 'Categories retrieved successfully',
        data: { categories } ,
      }));
  },

};
