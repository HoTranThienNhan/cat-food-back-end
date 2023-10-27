const { ObjectId } = require('mongodb');

class OrdersService {
    constructor(client) {
        this.Orders = client.db().collection("orders");
        this.Products = client.db().collection("products");
    }

    // Define database extraction methods using mongodb API
    extractContactData(payload) {
        const orders = {
            userId: payload.userId,
            name: payload.name,
            phone: payload.phone,
            address: payload.address,
            method: payload.method,
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
        const order = this.extractContactData(payload);
        
        // decrease product quality 
        const promisesProduct = payload.products.map(async (product) => {
            await this.Products.findOneAndUpdate(
                {
                    _id: ObjectId.isValid(product._id) ? new ObjectId(product._id) : null,
                    quality: { $gte: product.amount },
                },
                {
                    $inc: {
                        quality: -product.amount,
                        // sold: +product.amount,
                    }
                },
                { new: true }
            );
        });
        const resultsProduct = await Promise.all(promisesProduct);

        const result = await this.Orders.insertOne(order);
        return result;
    }
}

module.exports = OrdersService;