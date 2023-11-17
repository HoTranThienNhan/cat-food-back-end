const { ObjectId } = require('mongodb');


class ReviewsService {
    constructor(client) {
        this.Reviews = client.db().collection("reviews");
        this.Orders = client.db().collection("orders");
    }

    // Define database extraction methods using mongodb API
    extractContactData(payload) {
        const reviews = {
            orderId: payload.orderId,
            productId: payload.productId,
            userId: payload.userId,
            star: payload.star,
            description: payload.description,
            images: payload.images ? payload.images : [],
            createdAt: new Date(),
        };
        // Remove undefined fields
        Object.keys(reviews).forEach(
            (key) => reviews[key] == undefined && delete reviews[key]
        );
        return reviews;
    }

    async create(payload) {
        // update isReviewed from products in order
        await this.Orders.findOneAndUpdate(
            {
                _id: ObjectId.isValid(payload.orderId) ? new ObjectId(payload.orderId) : null,
                userId: payload.userId,
                products: {
                    $elemMatch: {
                        _id: ObjectId.isValid(payload.productId) ? new ObjectId(payload.productId) : null,
                    }
                },
            },
            {
                $set: {
                    "products.$.isReviewed": true
                }
            },
        );

        const review = this.extractContactData(payload);
        const result = await this.Reviews.insertOne(review);
        return result.value;
    }

    async getReviewsByProduct(id) {
        const cursor = await this.Reviews.find({
            productId: id,
        });
        return await cursor.toArray();
    }

}

module.exports = ReviewsService;