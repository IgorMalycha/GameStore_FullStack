const express = require('express');
require('dotenv').config();
const app = express();
const gameRoutes = require('./routes/GameRoutes');
const userRoutes = require('./routes/UserRoutes');
const cartRoutes = require('./routes/CartRoutes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/api', userRoutes);
app.use('/api', gameRoutes);
app.use('/api', cartRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie:` + PORT);
});
 