const fs = require('fs');
const path = require('path');

const files = {};

// Controller for file upload
exports.uploadFile = (req, res) => {
  const fileId = Date.now().toString();
  const filePath = path.join(__dirname, '../', req.file.path);
  files[fileId] = {
    path: filePath,
    name: req.file.originalname,
    size: req.file.size,
    lastModifiedTime: new Date().toISOString(),
  };

  res.json({ fileId });
};

// Controller for WOPI CheckFileInfo
exports.checkFileInfo = (req, res) => {
  const file = files[req.params.fileId];
  if (!file) return res.status(404).json({ error: 'File not found' });

  res.json({
    BaseFileName: file.name,
    OwnerId: 'user123',
    Size: file.size,
    Version: '1',
    UserId: 'user123',
    UserFriendlyName: 'John Doe',
    LastModifiedTime: file.lastModifiedTime,
    UserCanWrite: true,
    DisablePrint: false,
    DisableExport: false,
    DisableCopy: false,
  });
};

// Controller for WOPI GetFile
exports.getFileContents = (req, res) => {
  const file = files[req.params.fileId];
  if (!file) return res.status(404).json({ error: 'File not found' });

  res.sendFile(file.path);
};

// Controller for WOPI PutFile
exports.putFileContents = (req, res) => {
  const file = files[req.params.fileId];
  if (!file) return res.status(404).json({ error: 'File not found' });

  fs.writeFile(file.path, req.body, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to write file' });
    res.status(200).end();
  });
};
