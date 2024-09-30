const Category = require('../models/Category');

exports.getAllCategories = async (req, res, next) => {
  try {
    const { rows: categories, rowCount } = await Category.getAll(req.query);

    res.status(200).json({
      categories,
      totalCount: rowCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.getCategoriesWithAmount = async (_, res, next) => {
  try {
    const { rows: categories, rowCount } = await Category.getWithAmount();

    res.status(200).json({
      categories,
      totalCount: rowCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.createNewCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = new Category(name);

    const { rows: [newCategory] } = await category.save();
    
    res.status(201).json({ message: 'Category has been successfuly created!', data: newCategory });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const { rows: [category] } = await Category.getById(categoryId);

    res.status(200).json({ category });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};

exports.editCategoryData = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const bodyValues = req.body;

    const { rows: [category] } =await Category.editData(bodyValues, categoryId);

    res.status(201).json({ message: 'Category has been successfuly updated!', data: category });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    await Category.delete(categoryId);

    res.status(200).json({ message: 'Category has been successfuly deleted!' });
  } catch (error) {
    console.log(error);
    next(error);
  } 
};
