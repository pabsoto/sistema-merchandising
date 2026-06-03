// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');


const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const exclusiveRoutes = require('./routes/exclusive');
const cartRoutes = require('./routes/cart');
const artistRoutes = require('./routes/artists'); 
const merchRoutes = require('./routes/merch');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send(' API corriendo');
});


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/exclusive', exclusiveRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/artists', artistRoutes); 
app.use('/api/merch', merchRoutes);
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en el puerto ${PORT}`);
});
