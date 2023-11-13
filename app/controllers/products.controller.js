const ApiError = require("../api-error");
const ProductsService = require("../services/products.service");
const MongoDB = require("../utils/mongodb.util");

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const productsService = new ProductsService(MongoDB.client);
        documents = await productsService.findAll({});
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving products")
        );
    }
    return res.send(documents);
};

exports.findByType = async (req, res, next) => {
    let documents = [];
    try {
        const productsService = new ProductsService(MongoDB.client);
        documents = await productsService.findByType(req.params.id);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving products")
        );
    }
    return res.send(documents);
};

exports.searchByName = async (req, res, next) => {
    let documents = [];
    try {
        const productsService = new ProductsService(MongoDB.client);
        documents = await productsService.searchByName(req.params.name);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving products")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try {
        const productsService = new ProductsService(MongoDB.client);
        const document = await productsService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving product with id=${req.params.id}`)
        );
    }
};

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    if (!req.body?.type) {
        return next(new ApiError(400, "Type can not be empty"));
    }
    if (!req.body?.price) {
        return next(new ApiError(400, "Price can not be empty"));
    }
    if (!req.body?.image) {
        return next(new ApiError(400, "Image can not be empty"));
    }
    if (!req.body?.quantity) {
        return next(new ApiError(400, "quantity can not be empty"));
    }
    if (!req.body?.description) {
        return next(new ApiError(400, "Description can not be empty"));
    }

    // check existed user
    const productsService = new ProductsService(MongoDB.client);

    try {
        const document = await productsService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the product")
        );
    }
};

exports.update = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    if (!req.body?.type) {
        return next(new ApiError(400, "Type can not be empty"));
    }
    if (!req.body?.price) {
        return next(new ApiError(400, "Price can not be empty"));
    }
    if (!req.body?.image) {
        return next(new ApiError(400, "Image can not be empty"));
    }
    if (!req.body?.quantity) {
        return next(new ApiError(400, "quantity can not be empty"));
    }
    if (!req.body?.description) {
        return next(new ApiError(400, "Description can not be empty"));
    }

    const productsService = new ProductsService(MongoDB.client);

    try {
        const document = await productsService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving product with id=${req.params.id}`)
        );
    }
};

