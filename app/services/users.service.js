const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

class UsersService {
    constructor(client) {
        this.Users = client.db().collection("users");
    }

    // Define database extraction methods using mongodb API
    extractContactData(payload) {
        const users = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            password: payload.password,
            role: payload.role ? payload.role : 'Customer',
            favoriteProducts: [],
            createdAt: new Date(),
            active: payload.active === false ? false : true,
        };
        // Remove undefined fields
        Object.keys(users).forEach(
            (key) => users[key] == undefined && delete users[key]
        );
        return users;
    }

    async findById(id) {
        return await this.Users.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findByEmail(email) {
        return await this.Users.findOne({
            email: email,
        });
    }

    async create(payload) {
        const user = this.extractContactData(payload);

        // hash password with salt (cost = 10)
        const costHash = 10;
        const hashPassword = bcrypt.hashSync(user?.password, costHash);

        const result = await this.Users.insertOne({
            ...user,
            password: hashPassword,
        });
        return result.value;
    }

    async findAll() {
        const cursor = await this.Users.find();
        return await cursor.toArray();
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractContactData(payload);
        const result = await this.Users.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Users.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async addFavorite(userId, productId) {
        const filter = {
            _id: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
        };
        const result = await this.Users.findOneAndUpdate(
            filter,
            {
                $push:
                {
                    "favoriteProducts": new ObjectId(productId),
                },
            },
            { returnDocument: "after" }
        );
        return result;
    }

    async removeFavorite(userId, productId) {
        const filter = {
            _id: ObjectId.isValid(userId) ? new ObjectId(userId) : null,
        };
        const result = await this.Users.findOneAndUpdate(
            filter,
            {
                $pull:
                {
                    "favoriteProducts": new ObjectId(productId),
                },
            },
            { returnDocument: "after" }
        );
        return result;
    }


}

module.exports = UsersService;