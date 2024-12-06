/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/multer');
const { uploadImage, deleteImage } = require('../controllers/upload.controller');

router.use(protect);

router.post('/', upload.single('image'), uploadImage);
router.delete('/', deleteImage);

module.exports = router;