import Category from '../models/categoryModel.js';

// @desc     Get all categories
// @method   GET
// @endpoint /api/v1/categories
// @access   Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc     Get all categories (admin - includes inactive)
// @method   GET
// @endpoint /api/v1/categories/all
// @access   Private/Admin
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc     Get single category by slug
// @method   GET
// @endpoint /api/v1/categories/:slug
// @access   Public
const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      res.statusCode = 404;
      throw new Error('Category not found!');
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// @desc     Create category
// @method   POST
// @endpoint /api/v1/categories
// @access   Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      res.statusCode = 400;
      throw new Error('Category already exists.');
    }

    const category = new Category({
      name,
      description: description || '',
      image: image || ''
    });

    const createdCategory = await category.save();
    res.status(201).json({ message: 'Category created', category: createdCategory });
  } catch (error) {
    next(error);
  }
};

// @desc     Update category
// @method   PUT
// @endpoint /api/v1/categories/:id
// @access   Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.statusCode = 404;
      throw new Error('Category not found!');
    }

    category.name = req.body.name || category.name;
    category.description = req.body.description !== undefined ? req.body.description : category.description;
    category.image = req.body.image !== undefined ? req.body.image : category.image;
    category.isActive = req.body.isActive !== undefined ? req.body.isActive : category.isActive;

    // Regenerate slug if name changed
    if (req.body.name) {
      category.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const updatedCategory = await category.save();
    res.status(200).json({ message: 'Category updated', category: updatedCategory });
  } catch (error) {
    next(error);
  }
};

// @desc     Delete category
// @method   DELETE
// @endpoint /api/v1/categories/:id
// @access   Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.statusCode = 404;
      throw new Error('Category not found!');
    }
    await Category.deleteOne({ _id: category._id });
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

export {
  getCategories,
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
