const { ObjectId } = require('mongodb');

class ProductsService {
    constructor(client) {
        this.Products = client.db().collection("products");
    }

    // Define database extraction methods using mongodb API
    extractContactData(payload) {
        const products = {
            name: payload.name,
            type: payload.type,
            price: payload.price,
            image: payload.image,
            quality: payload.quality,
            description: payload.description,
        };
        // Remove undefined fields
        Object.keys(products).forEach(
            (key) => products[key] == undefined && delete products[key]
        );
        return products;
    }

    async findAll() {
        const cursor = await this.Products.find();
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Products.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async findByName(name) {
        return await this.Products.findOne({
            name: name,
        });
    }

    async create(payload) {
        const product = this.extractContactData(payload);
        const result = await this.Products.insertOne(product);
        return result.value;
    }

}

module.exports = ProductsService;