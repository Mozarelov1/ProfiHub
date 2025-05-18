require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRouter = require('./auth/router/index');
const catalogRouter = require('./catalog/router/index');
const accMgmtRouter = require('./account-management/router/index')
const errorMiddleware = require('./auth/middlewares/error-middleware')
const authMiddleware  = require('./auth/middlewares/auth-middleware');


const app = express();


const port = process.env.PORT || 2000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: `${process.env.CLIENT_URL}`
}));

app.use('/api/auth',authRouter);
app.use('/api/catalog',authMiddleware,catalogRouter);
app.use('/api/acc-mgmt',authMiddleware,accMgmtRouter)

app.use(errorMiddleware);


const start = async () =>{
    try{
        await mongoose.connect(`mongodb:/${process.env.DB_URL}`,
            {   
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        app.listen(port,() => console.log(`server started on ${port}`))
    }catch(e){
        console.log(e)
    }
};

start();