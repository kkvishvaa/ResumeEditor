const express = require('express');
const multer = require('multer');
const cors = require('cors');
const wopiRoutes = require('./routes/wopiRoutes');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(express.json());
app.use('/', wopiRoutes);

const PORT = 8080;
app.listen(PORT, () => console.log(`WOPI backend running on port ${PORT}`));
