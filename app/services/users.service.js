const { ObjectId } = require('mongodb');

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
            password: payload.password
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
        const result = await this.Users.insertOne(user);
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

}

module.exports = UsersService;