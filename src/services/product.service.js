/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const Product = require('../models/product.model');
const cloudinary = require('../utils/cloudinary');
const AppError = require('../utils/appError');

class ProductService {
  // Create new product
  async createProduct(productData, sellerId) {
    try {
      productData.seller = sellerId;
      const product = await Product.create(productData);
      return product;
    } catch (error) {
      throw new AppError('Gagal membuat produk', 400);
    }
  }

  // Upload image to cloudinary
  async uploadImage(file) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'products',
        width: 1000,
        crop: 'scale'
      });
      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    } catch (error) {
      throw new AppError('Gagal mengupload gambar', 400);
    }
  }

  // Get all products with filters
  async getProducts(filters = {}, page = 1, limit = 10) {
    try {
      const query = {};

      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.minPrice || filters.maxPrice) {
        query.price = {};
        if (filters.minPrice) query.price.$gte = filters.minPrice;
        if (filters.maxPrice) query.price.$lte = filters.maxPrice;
      }

      if (filters.city) {
        query.city = { $regex: filters.city, $options: 'i' };
      }

      const products = await Product.find(query)
        .populate('seller', 'name phone rating')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort('-createdAt');

      const total = await Product.countDocuments(query);

      return {
        products,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new AppError('Gagal mengambil data produk', 400);
    }
  }
}

module.exports = new ProductService();