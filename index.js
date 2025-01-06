const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const connectDB = require('./config/db');
const PORT = 4000;
const cors = require('cors')

const app = express();

const authRoutes = require('./routes/auth');
const weaponRoutes = require('./routes/weapon');
const officerRoutes = require('./routes/officerRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const maintenanceRoutes = require('./routes/MaintenanceLog');
const AmmunitionRoutes = require('./routes/ammunition')

//middlewares
connectDB();
app.use(express.json());
app.use(cors());
app.use('/api/admin', authRoutes);
app.use('/api/weapons', weaponRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/items", AmmunitionRoutes);

app.listen(PORT, ()=>{
    console.log('backend  running at http://localhost:4000');
})