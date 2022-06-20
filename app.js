const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');

const authMiddleware = require('./middlewares/authMiddleware');

require('dotenv').config();

const indexRoute = require('./routes/indexRouter');
const stocksRoute = require('./routes/stocksRouter');

const app = express();

app.use(express.json());

app.use(express.static('public'));

app.use(expressLayouts);

app.set('view engine', 'ejs');

app.use(cookieParser());

// if its local database, use env.DB instead of env.DB_ATLAS
mongoose
  .connect(process.env.DB_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((con) => console.log('Database connected'))
  .catch((err) => console.log(err));

app.use('*', authMiddleware.getUser);
app.use('/', indexRoute);
app.use('/stocks', stocksRoute);

app.listen(process.env.PORT, () => console.log('Server started'));
