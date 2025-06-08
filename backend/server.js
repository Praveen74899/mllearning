    require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');

const app = express();

app.use(cors());
app.use(express.json());



app.use('/api', authRoutes);
app.use('/projects',projectRoutes);


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
