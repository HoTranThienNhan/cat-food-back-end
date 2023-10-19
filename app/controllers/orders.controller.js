const ApiError = require("../api-error");
const OrdersService = require("../services/orders.service");
const MongoDB = require("../utils/mongodb.util");

exports.findOne = async (req, res, next) => {
    try {
        const ordersService = new OrdersService(MongoDB.client);
        const document = await ordersService.findByUserId(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Order not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving order with user id=${req.params.id}`)
        );
    }
};

exports.add = async (req, res, next) => {
    // if (!req.body?.userId) {
    //     return next(new ApiError(400, "Name can not be empty"));
    // } 
    // if (!req.body?.type) {
    //     return next(new ApiError(400, "Type can not be empty"));
    // } 
    // if (!req.body?.price) {
    //     return next(new ApiError(400, "Price can not be empty"));
    // } 
    // // if (!req.body?.image) {
    // //     return next(new ApiError(400, "Image can not be empty"));
    // // } 
    // if (!req.body?.quality) {
    //     return next(new ApiError(400, "Quality can not be empty"));
    // } 
    // if (!req.body?.description) {
    //     return next(new ApiError(400, "Description can not be empty"));
    // } 

    // check existed user
    const ordersService = new OrdersService(MongoDB.client);

    try {
        const document = await ordersService.add(req.body);
        if (document) {
            return res.send({ message: "Order was added successfully" });
        } else {
            return next(
                new ApiError(404, "Order not found")
            );
        }
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while creating the order")
        );
    }
};