/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const ItemService = {
  // Add sell item
  addSellItem: catchAsync(async (userId, itemData) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.sellItems.push(itemData);
    await user.save();
    return user.sellItems[user.sellItems.length - 1];
  }),

  // Add buy item
  addBuyItem: catchAsync(async (userId, itemData) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.buyItems.push(itemData);
    await user.save();
    return user.buyItems[user.buyItems.length - 1];
  }),

  // Update sell item stock
  updateSellItemStock: catchAsync(async (userId, itemId, newStock) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const sellItem = user.sellItems.id(itemId);
    if (!sellItem) {
      throw new AppError('Item not found', 404);
    }

    sellItem.stock.amount = newStock;
    await user.save();
    return sellItem;
  }),

  // Update buy item current amount
  updateBuyItemAmount: catchAsync(async (userId, itemId, amount) => {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const buyItem = user.buyItems.id(itemId);
    if (!buyItem) {
      throw new AppError('Item not found', 404);
    }

    if (buyItem.currentAmount.amount + amount > buyItem.maxAmount.amount) {
      throw new AppError('Exceeds maximum capacity', 400);
    }

    buyItem.currentAmount.amount += amount;
    await user.save();
    return buyItem;
  }),

  // Find nearby sellers
  findNearbySellers: catchAsync(async (coordinates, category, radius) => {
    return await User.find({
      'sellItems': {
        $elemMatch: {
          category: category,
          'stock.amount': { $gt: 0 }
        }
      },
      'location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: radius * 1000 // convert to meters
        }
      }
    }).select('name location sellItems rating');
  }),

  // Find nearby buyers
  findNearbyBuyers: catchAsync(async (coordinates, category, radius) => {
    return await User.find({
      'buyItems': {
        $elemMatch: {
          category: category,
          $expr: {
            $lt: ['$currentAmount.amount', '$maxAmount.amount']
          }
        }
      },
      'location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: radius * 1000
        }
      }
    }).select('name location buyItems rating');
  })
};

module.exports = ItemService;