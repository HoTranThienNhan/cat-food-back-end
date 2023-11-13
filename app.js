const express = require('express');
const cors = require('cors');
const usersRouter = require('./app/routes/users.route');
const productsRouter = require('./app/routes/products.route');
const ordersRouter = require('./app/routes/orders.route');
const reviewsRouter = require('./app/routes/reviews.route');
const ApiError = require('./app/api-error');

const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to cat food application." });
});

app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/reviews", reviewsRouter);


// handle 404 response
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

// define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;