const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cors = require('cors');
const newsRoutes = require('./routes/news');


require('dotenv').config();

const app = express();


app.use(bodyParser.json());
app.use(cors());

app.use('/apiNews',newsRoutes);

mongoose
.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log('MongoDB Connected Sucessfully!!');
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((err)=>{
    console.log('Error Occured: ',err.message);  
});
