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
            status: payload.status,
            createdAt: new Date(),
        };
        payload.products.map((product) => {
            orders.products.push({
                _id: new ObjectId(product._id),
                name: product.name,
                type: product.type,
                price: product.price,
                image: product.image,
                amount: product.amount,
                description: product.description,
                isReviewed: false,
            });
        });

        // Remove undefined fields
        Object.keys(orders).forEach(
            (key) => orders[key] == undefined && delete orders[key]
        );
        return orders;
    }

    async findByUserId(userId) {
        const cursor = await this.Orders.find({
            userId: userId,
        });
        return await cursor.toArray();
    }

    async findByOrderId(orderId) {
        const cursor = await this.Orders.find({
            _id: ObjectId.isValid(orderId) ? new ObjectId(orderId) : null,
        });
        return cursor.toArray();
    }

    async findByOrderStatus(status) {
        const cursor = await this.Orders.find({
            status: status
        });
        return cursor.toArray();
    }

    async findAll() {
        const cursor = await this.Orders.find({});
        return await cursor.toArray();
    }

    async add(payload) {
        const order = this.extractContactData(payload);

        // decrease product quantity 
        const promisesProduct = payload.products.map(async (product) => {
            await this.Products.findOneAndUpdate(
                {
                    _id: ObjectId.isValid(product._id) ? new ObjectId(product._id) : null,
                    quantity: { $gte: product.amount },
                },
                {
                    $inc: {
                        quantity: -product.amount,
                        sold: +product.amount,
                    }
                },
                { new: true }
            );
        });
        const resultsProduct = await Promise.all(promisesProduct);

        const result = await this.Orders.insertOne(order);
        return result;
    }

    async updateStatus(id, status) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const result = await this.Orders.findOneAndUpdate(
            filter,
            { $set: { "status": status } },
            { returnDocument: "after" }
        );
        return result;
    }

    async cancel(order, status) {
        const orderId = order._id;
        const products = order.products;

        const filter = {
            _id: ObjectId.isValid(orderId) ? new ObjectId(orderId) : null,
        };

        if (filter) {
            const promisesProduct = products.map(async (product) => {
                await this.Products.findOneAndUpdate(
                    {
                        _id: ObjectId.isValid(product._id) ? new ObjectId(product._id) : null,
                        quantity: { $gte: product.amount },
                    },
                    {
                        $inc: {
                            quantity: +product.amount,
                            sold: -product.amount,
                        }
                    },
                    { new: true }
                );
            });
            const resultsProduct = await Promise.all(promisesProduct);
        }

        const result = await this.Orders.findOneAndUpdate(
            filter,
            { $set: { "status": status } },
            { returnDocument: "after" }
        );
        return result;
    }

}

module.exports = OrdersService;