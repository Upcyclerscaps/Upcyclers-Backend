/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('./appError');
const catchAsync = require('./catchAsync');  // Tambahkan import ini

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

exports.uploadPhoto = upload.single('image');

exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/images/${req.file.filename}`);

  next();
});