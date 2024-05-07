const dotenv = require("dotenv");
const express = require("express");
const helmet = require("helmet");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");


const postRoutes = require('./routes/post');
const categoryRoutes = require('./routes/categories');
const tagRoutes = require('./routes/tags');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');

const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

dotenv.config();
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

//middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());

//routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);


//error middlewares
app.use(notFound);
app.use(errorHandler);

//connect to db and start server
connectDB();


app.listen(8001, () => {
  console.log("listening on port 8001");
});