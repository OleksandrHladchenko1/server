const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/categoryController');

router.route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.createNewCategory);
  
router.route('/category-with-amount')
  .get(categoryController.getCategoriesWithAmount);
  
router.route('/:id')
  .get(categoryController.getCategoryById)
  .patch(categoryController.editCategoryData)
  .delete(categoryController.deleteCategory);  

module.exports = router;
