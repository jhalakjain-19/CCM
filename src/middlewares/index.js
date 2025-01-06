const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const errorHandler = require('./middlewares/errorHandler.js');
//const createUserTable = require('./data/createUserTable.js');
const { roleNames } = require('./utils/commonUtils');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', userRoutes);
/*app.get('/', (req,res)=>{
    res.send("hello plot team1");
});*/
console.log(`User role is: ${roleNames[1]}`);
// Error handling middleware
app.use(errorHandler);  // Corrected this line


//create table before server start
//createUserTable();

// Server running
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
