import ProductModel from './models/products.model.js';

export default class ProductsManager {
    static async initializeIdCounter() {
        try {
            const products = await ProductModel.find();
            if (products.length > 0) {
                const maxId = Math.max(...products.map(product => product.id));
                return maxId + 1;
            }
            return 1; // Si no hay productos, comienza desde el ID 1
        } catch (error) {
            console.error('Error initializing ID counter:', error);
            throw error;
        }
    }

    static async addProduct(productData) {
        const { title, description, code, price, stock, category, thumbnails } = productData;

        if (!title || !description || !code || !price || !stock || !category) {
            console.error('Title, description, code, price, stock, and category are required fields 🎯');
            return;
        }

        try {
            // Verificar si ya existe un producto con el mismo código
            const existingProduct = await ProductModel.findOne({ code: code });

            if (existingProduct) {
                console.error(`Product with code ${code} already exists`);
                return;
            }
            const newProduct = await ProductModel.create({
                title,
                description,
                code,
                price,
                status: true, // Assuming default status is true
                stock,
                category,
                thumbnails: thumbnails || [],
            });

            console.log(`Product with code ${code} was added 😎`);
            return newProduct;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    static async getProducts(criteria, options) {
        try {
            return ProductModel.paginate(criteria, options);
        } catch (error) {
            console.error('Error getting products:', error);
            throw error;
        }
    }


    static async getProductById(productId) {
        try {
            return ProductModel.findById(productId);
        } catch (error) {
            console.error('Error getting product by ID:', error);
            throw error;
        }
    }

    static async updateProduct(id, data) {
        try {
            await ProductModel.updateOne({ _id: id }, { $set: data });
            console.log(`Product id ${id} updated! 😎`);
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    static async deleteProduct(id) {
        try {
            await ProductModel.deleteOne({ _id: id });
            console.log(`Product id ${id} deleted! 😎`);
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
}

