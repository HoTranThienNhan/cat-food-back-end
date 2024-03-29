const ApiError = require("../api-error");
const UsersService = require("../services/users.service");
const MongoDB = require("../utils/mongodb.util");
const bcrypt = require('bcrypt');

exports.findOne = async (req, res, next) => {
    try {
        const usersService = new UsersService(MongoDB.client);
        const document = await usersService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving users with id=${req.params.id}`)
        );
    }
};

exports.findOneByEmail = async (req, res, next) => {
    try {
        const usersService = new UsersService(MongoDB.client);
        const document = await usersService.findByEmail(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving users with name=${req.params.id}`)
        );
    }
};

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    if (!req.body?.email) {
        return next(new ApiError(400, "Email can not be empty"));
    }
    if (!req.body?.phone) {
        return next(new ApiError(400, "Phone can not be empty"));
    }
    if (!req.body?.address) {
        return next(new ApiError(400, "Address can not be empty"));
    }
    if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"));
    }

    // check existed user
    const usersService = new UsersService(MongoDB.client);
    const existedUser = await usersService.findByEmail(req.body?.email);
    if (existedUser) {
        return next(new ApiError(400, "User already existed"));
    }

    try {
        const document = await usersService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the user")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const usersService = new UsersService(MongoDB.client);
        documents = await usersService.findAll({});
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving users")
        );
    }
    return res.send(documents);
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(404, "Data to update cannot be empty"));
    }
    if (!req.body.name) {
        return next(new ApiError(404, "Name cannot be empty"));
    }
    if (!req.body.email) {
        return next(new ApiError(404, "Email cannot be empty"));
    }
    if (!req.body.phone) {
        return next(new ApiError(404, "Phone cannot be empty"));
    }
    if (!req.body.address) {
        return next(new ApiError(404, "Address cannot be empty"));
    }
    try {
        const usersService = new UsersService(MongoDB.client);
        const document = await usersService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send({ message: "User was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating user with id=${req.params.id}`)
        );
    }
};

exports.signin = async (req, res, next) => {
    try {
        const usersService = new UsersService(MongoDB.client);
        const { email, password } = req.body;

        if (!email) {
            return next(new ApiError(404, "Email is required"));
        }
        if (!password) {
            return next(new ApiError(404, "Password is required"));
        }

        const document = await usersService.findByEmail(email);

        if (!document) {
            return next(new ApiError(404, "Email or password incorrect"));
        } else {
            if (document.active === false) {
                return next(new ApiError(404, "User is unactive"));
            }
            // compare password and password in database
            const comparePassword = bcrypt.compareSync(password, document?.password);
            if (!comparePassword) {
                return next(new ApiError(404, "Email or password incorrect"));
            }
        }

        return res.send({
            status: 'OK',
            message: 'SIGN IN SUCCESS'
        });

    } catch (error) {
        return next(
            new ApiError(500, `Error signin user`)
        );
    }
};

exports.signinAdmin = async (req, res, next) => {
    try {
        const usersService = new UsersService(MongoDB.client);
        const { email, password } = req.body;

        if (!email) {
            return next(new ApiError(404, "Email is required"));
        }
        if (!password) {
            return next(new ApiError(404, "Password is required"));
        }

        const document = await usersService.findByEmail(email);

        if (!document) {
            return next(new ApiError(404, "Email or password incorrect"));
        } else {
            if (document.active === false) {
                return next(new ApiError(404, "User is unactive"));
            }
            // compare password and password in database
            const comparePassword = bcrypt.compareSync(password, document?.password);
            if (!comparePassword) {
                return next(new ApiError(404, "Email or password incorrect"));
            }

            // check admin
            if (document?.role === 'Customer') {
                return next(new ApiError(404, "Account doesn't exist"));
            }
        }

        return res.send({
            status: 'OK',
            message: 'SIGN IN SUCCESS'
        });

    } catch (error) {
        return next(
            new ApiError(500, `Error signin user`)
        );
    }
};


exports.delete = async (req, res, next) => {
    try {
        const usersService = new UsersService(MongoDB.client);
        const document = await usersService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send({ message: "User was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete user with id=${req.params.id}`)
        );
    }
};

exports.addFavorite = async (req, res, next) => {
    try {
        const usersService = new UsersService(MongoDB.client);
        const document = await usersService.addFavorite(req.params.userId, req.params.productId);
        if (!document) {
            new ApiError(400, "Cannot add favorite product" );
        }
        return res.send({ message: "Added favorite product successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error add favorite product`)
        );
    }
};

exports.removeFavorite = async (req, res, next) => {
    try {
        const usersService = new UsersService(MongoDB.client);
        const document = await usersService.removeFavorite(req.params.userId, req.params.productId);
        if (!document) {
            new ApiError(400, "Cannot remove favorite product" );
        }
        return res.send({ message: "Removed favorite product successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error remove favorite product`)
        );
    }
};

