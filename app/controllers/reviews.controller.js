const ApiError = require("../api-error");
const ReviewsService = require("../services/reviews.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
    if (!req.body?.orderId) {
        return next(new ApiError(400, "Order ID can not be empty"));
    }
    if (!req.body?.userId) {
        return next(new ApiError(400, "User ID can not be empty"));
    }
    if (!req.body?.productId) {
        return next(new ApiError(400, "Product ID can not be empty"));
    }
    if (!req.body?.star) {
        return next(new ApiError(400, "Star rating can not be empty"));
    }
    if (!req.body?.description) {
        return next(new ApiError(400, "Description rating can not be empty"));
    }

    const reviewsService = new ReviewsService(MongoDB.client);

    try {
        const document = await reviewsService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the reviews")
        );
    }
};


exports.getReviewsByProduct = async (req, res, next) => {
    let documents = [];
    try {
        if (!req.params?.id) {
            return next(new ApiError(400, "Product ID can not be empty"));
        }

        const reviewsService = new ReviewsService(MongoDB.client);
        documents = await reviewsService.getReviewsByProduct(req.params.id);

    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving reviews")
        );
    }
    return res.send(documents);
};