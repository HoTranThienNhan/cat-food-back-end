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
            quantity: payload.quantity,
            description: payload.description,
            sold: 0,
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

    async findByType(type) {
        const cursor = await this.Products.find({
            type: type,
        });
        return await cursor.toArray();
    }

    async searchByName(productName) {
        const cursor = await this.Products.find({
            name: new RegExp(productName, "i"),
        });
        return await cursor.toArray();
    }

    async create(payload) {
        const product = this.extractContactData(payload);
        const result = await this.Products.insertOne(product);
        return result.value;
    }

    async update(id, payload) {

        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const result = await this.Products.findOneAndUpdate(
            filter,
            { $set: 
                { 
                    "name": payload.name, 
                    "type": payload.type,
                    "price": payload.price,
                    "quantity": payload.quantity,
                    "description": payload.description,
                    "image": payload.image,
                } 
            },
            { returnDocument: "after" }
        );
        return result;
    }

}

module.exports = ProductsService;