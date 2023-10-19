const { ObjectId } = require('mongodb');

class OrdersService {
    constructor(client) {
        this.Orders = client.db().collection("orders");
    }

    // Define database extraction methods using mongodb API
    extractContactData(payload) {
        const orders = {
            userId: payload.userId,
            name: payload.name,
            phone: payload.phone,
            address: payload.address,
            deliveryFee: payload.deliveryFee,
            discount: payload.discount,
            totalPrice: payload.totalPrice,
            products: [],
            createdAt: new Date(),
        };
        payload.products.map((product) => {
            orders.products.push({
                name: product.name,
                type: product.type,
                price: product.price,
                image: product.image,
                amount: product.amount,
                description: product.description,
            });
        });

        // Remove undefined fields
        Object.keys(orders).forEach(
            (key) => orders[key] == undefined && delete orders[key]
        );
        return orders;
    }

    async findByUserId(userId) {
        return await this.Orders.findOne({
            userId: userId,
        });
    }

    async add(payload) {
        const filter = {
            userId: payload.userId,
        };
        const order = this.extractContactData(payload);

        const result = await this.Orders.insertOne(order);
        return result;
    }
}

module.exports = OrdersService;