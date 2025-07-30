const express = require('express');
const { uploadFile, checkFileInfo, getFileContents, putFileContents } = require('../controllers/wopiController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// File upload endpoint
router.post('/upload', upload.single('file'), uploadFile);

// WOPI CheckFileInfo endpoint
router.get('/wopi/files/:fileId', checkFileInfo);

// WOPI GetFile endpoint
router.get('/wopi/files/:fileId/contents', getFileContents);

// WOPI PutFile endpoint
router.post('/wopi/files/:fileId/contents', express.raw({ type: '*/*' }), putFileContents);

module.exports = router;
