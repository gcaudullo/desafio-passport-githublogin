import CartModel from './models/carts.model.js';

export default class CartsManager {
    static async addCart() {
        try {
            const newCart = await CartModel.create({
                products: []
            });
            console.log(`Cart created with id: ${newCart._id} 😎`);
            return newCart._id; // Devuelve el ID del carrito creado
        } catch (error) {
            console.error('Error creating Cart:', error);
            throw error;
        }
    }

    static async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product', '_id title description price status stock category');;
            if (!cart) {
                return -1; // Devuelve -1 si el carrito no se encuentra
            } else {
                return cart.products;
            }
        } catch (error) {
            console.error('Error getting cart by ID:', error);
            throw error;
        }
    }

    static async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                console.error(`Cart id ${cartId} not found 😨`);
                return;
            }

            const existingProduct = cart.products.find(product => {
                return product.product.toString() === productId});

            if (existingProduct) {
                // Si el producto ya existe, incrementa la cantidad
                existingProduct.quantity += quantity;
            } else {
                // Si el producto no existe en el carrito, lo agrega
                cart.products.push({ product: productId, quantity: quantity });
            }

            await cart.save(); // Guarda el carrito actualizado en la base de datos
            console.log(`Cart id ${cartId} updated! 😎`);
        } catch (error) {
            console.error('Error adding product to cart:', error);
            throw error;
        }
    }

    static async removeProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                console.error(`Cart id ${cartId} not found 😨`);
                return;
            }
    
            // Filtra los productos, excluyendo el que se debe eliminar
            cart.products = cart.products.filter(product => product.product.toString() !== productId);
    
            await cart.save(); // Guarda el carrito actualizado en la base de datos
            console.log(`Product id ${productId} removed from Cart id ${cartId}! 😎`);
        } catch (error) {
            console.error('Error removing product from cart:', error);
            throw error;
        }
    }

    static async updateCart(cartId, newProducts) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                console.error(`Cart id ${cartId} not found 😨`);
                return;
            }
            // Reemplaza la lista de productos del carrito con la nueva lista
            cart.products = newProducts;
            await cart.save(); // Guarda el carrito actualizado en la base de datos
            console.log(`Cart id ${cartId} updated with new products! 😎`);
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    }

    static async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                console.error(`Cart id ${cartId} not found 😨`);
                return;
            }
    
            const existingProduct = cart.products.find(product => {
                return product.product.toString() === productId
            });
    
            if (existingProduct) {
                // Actualiza la cantidad del producto especificado
                existingProduct.quantity = newQuantity;
                await cart.save(); // Guarda el carrito actualizado en la base de datos
                console.log(`Product id ${productId} quantity updated in Cart id ${cartId}! 😎`);
            } else {
                console.error(`Product id ${productId} not found in Cart id ${cartId} 😨`);
            }
        } catch (error) {
            console.error('Error updating product quantity in cart:', error);
            throw error;
        }
    }

    static async removeAllProductsFromCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                console.error(`Cart id ${cartId} not found 😨`);
                return;
            }
    
            // Elimina todos los productos del carrito
            cart.products = [];
    
            await cart.save(); // Guarda el carrito actualizado en la base de datos
            console.log(`All products removed from Cart id ${cartId}! 😎`);
        } catch (error) {
            console.error('Error removing all products from cart:', error);
            throw error;
        }
    }
    
    
    
    
}