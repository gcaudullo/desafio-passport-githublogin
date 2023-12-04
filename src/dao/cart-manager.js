import fs from 'fs';
import { json } from 'stream/consumers'
export default class CartManager {
    constructor(path) {
        this.path = path;
        this.counter = 1;
        this.initializeIdCounter();
    }

    async initializeIdCounter() {
        try {
            const carts = await getJsonFromFile(this.path);
            if (carts.length > 0) {
                // Encuentra el máximo ID actualmente utilizado
                const maxId = Math.max(...carts.map(cart => cart.id));
                this.counter = maxId + 1; // Establece el contador al siguiente ID disponible
            }
        } catch (error) {
            console.error('Error initializing cart ID counter:', error);
        }
    }

    async addCart() {
        try {
            const carts = await getJsonFromFile(this.path);
            const newCart = {
                id: this.counter,
                products: []
            }
            this.counter++
            carts.push(newCart)
            await saveJsonInFile(this.path, carts)
            console.log(`Cart created with id: ${id} 😎`)
        } catch (error) {
            console.error('Error creating Cart:', error)
        }
    }


    async getCartById(cartId) {
        try {
            const carts = await getJsonFromFile(this.path)
            const cart = carts.find(cart => cart.id === cartId);
            if (!cart) {
                return -1;
            } else {
                return cart.products;
            }
        } catch (error) {
            console.error(error)
        }

    }


    async addProductToCart(cartId, productId, quantity) {
        const carts = await getJsonFromFile(this.path);
        const position = carts.findIndex((cart) => cart.id === cartId);
        if (position === -1) {
            console.error(`Cart id ${cartId} not found 😨`);
            return;
        }
        const cart = carts[position];
        const existingProduct = cart.products.find(product => product.product === productId);

        if (existingProduct) {
            // Si el producto ya existe, incrementa la cantidad
            existingProduct.quantity += quantity;
        } else {
            // Si el producto no existe en el carrito, lo agrego
            cart.products.push({ product: productId, quantity: quantity });
        }
        await saveJsonInFile(this.path, carts); // Guarda los carritos actualizados
        console.log(`Cart id ${cartId} updated! 😎`);
    }

}

const getJsonFromFile = async (path) => {
    if (!fs.existsSync(path)) {
        return [];
    }
    const content = await fs.promises.readFile(path, 'utf-8');
    return JSON.parse(content);
};

const saveJsonInFile = (path, data) => {
    const content = JSON.stringify(data, null, '\t');
    return fs.promises.writeFile(path, content, 'utf-8');
}


//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
async function test() {
    const cartManager = new CartManager('./carts.json');
}

test();

// Exporta la clase CartManager para que esté disponible en otros archivos
// export default CartManager;
