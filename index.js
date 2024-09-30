require('dotenv').config();

const express = require('express');
const cors = require('cors');

const userRouter = require('./routes/userRouter');
const lotRouter = require('./routes/lotRouter');
const categoryRouter = require('./routes/categoryRouter');
const eventRouter = require('./routes/eventRouter');
const authRouter = require('./routes/authRouter');

const { authenticateToken } = require('./middlewares/authenticateToken');

const app = express();

app.use(cors());
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/users', authenticateToken, userRouter);
app.use('/lots', authenticateToken, lotRouter);
app.use('/categories', authenticateToken, categoryRouter);
app.use('/events', authenticateToken, eventRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is run on port ${PORT}`));
