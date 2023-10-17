const { ObjectId } = require('mongodb');

class CartsService {
    constructor(client) {
        this.Carts = client.db().collection("carts");
    }

    // Define database extraction methods using mongodb API
    extractContactData(payload) {
        const carts = {
            userId: payload.userId,
            products: [],
        };
        payload.products.map((product) => {
            carts.products.push({
                name: product.name,
                type: product.type,
                price: product.price,
                image: product.image,
                amount: product.amount,
                description: product.description,
            });
        });

        // Remove undefined fields
        Object.keys(carts).forEach(
            (key) => carts[key] == undefined && delete carts[key]
        );
        return carts;
    }

    async findByUserId(userId) {
        return await this.Carts.findOne({
            userId: userId,
        });
    }

    async add(payload) {
        const filter = {
            userId: payload.userId,
        };
        const cart = this.extractContactData(payload);
        let result = null;

        // update cart if already existed
        result = await this.Carts.findOneAndUpdate(
            filter,
            { $set: cart },
            { returnDocument: "after" }
        );

        // create cart if not exist
        // the user do not have cart (not have anything in cart)
        if (!result) {
            result = await this.Carts.insertOne(cart);
        }
        return result;
    }
}

module.exports = CartsService;