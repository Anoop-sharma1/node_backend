const express = require('express');
const imageController = require('../controllers/image.controller');
const imageUploader = require('../helper/image-uploader');
const authorize = require('middleware/authorize');  

const router = express.Router();

router.post('/uploads', authorize(), imageUploader.upload.single('image'), imageController.upload);

module.exports = router;
