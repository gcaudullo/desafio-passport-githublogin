import CartsManager from '../dao/cart.manager.js';
import express from 'express';

const router = express.Router();

router.post('/carts', async (req, res) => {
    try {
        const cartId = await CartsManager.addCart();
        res.status(201).json({ message: 'Cart created successfully' , cartId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating cart.' });
    }
});

router.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        const products = await CartsManager.getCartById(cartId);
        if (products === -1) {
            res.status(404).json({ error: 'There is no cart with that ID.' });
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obtaining products.' });
    }
});

router.post('/carts/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        await CartsManager.addProductToCart(cartId, productId, quantity);
        res.status(201).json({ message: `Product id ${productId} added to Cart id ${cartId}!😎` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding product to cart' });
    }
});

// DELETE api/carts/:cid/products/:pid
router.delete('/carts/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        await CartsManager.removeProductFromCart(cartId, productId);
        res.status(200).json({ message: `Product id ${productId} removed from Cart id ${cartId}! 😎` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing product from cart.' });
    }
});

// PUT api/carts/:cid
router.put('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const products = req.body.products;
    try {
        await CartsManager.updateCart(cartId, products);
        res.status(200).json({ message: `Cart id ${cartId} updated with new products! 😎` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating cart.' });
    }
});

// PUT api/carts/:cid/products/:pid
router.put('/carts/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    try {
        await CartsManager.updateProductQuantity(cartId, productId, quantity);
        res.status(200).json({ message: `Product id ${productId} quantity updated in Cart id ${cartId}! 😎` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating product quantity in cart.' });
    }
});

// DELETE api/carts/:cid
router.delete('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        await CartsManager.removeAllProductsFromCart(cartId);
        res.status(200).json({ message: `All products removed from Cart id ${cartId}! 😎` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing all products from cart.' });
    }
});


export default router;


// import express from 'express';

// const router = express.Router();




// const cartManager = new CartManager('./carts.json');


// router.post('/carts', (req, res) => {
//     cartManager.addCart()
//         .then(() => {
//             res.status(201).json({ message: 'Cart created successfully' });
//         })
//         .catch(error => {
//             console.error(error);
//             res.status(500).json({ error: 'Error creating cart.' });
//         })
// });

// // Ruta GET para listar los productos en un carrito específico (por ID de carrito)
// router.get('/carts/:cid', (req, res) => {
//     const cartId = req.params.cid;
//     cartManager.getCartById(parseInt(cartId))
//         .then(products => {
//             if (products === -1) {
//                 res.status(404).json({ error: 'There is no cart with that ID.' });
//             } else {
//                 res.status(200).json(products);
//             }
//         })
//         .catch(error => {
//             console.error(error);
//             res.status(500).json({ error: 'Error obtaining product.' });
//         });
// });


// // Ruta POST para agregar un producto a un carrito
// router.post('/carts/:cid/product/:pid', (req, res) => {
//     const cartId = req.params.cid;
//     const productId = req.params.pid;
//     const quantity = req.body.quantity || 1; // La cantidad predeterminada es 1
//     cartManager.addProductToCart(parseInt(cartId), parseInt(productId), parseInt(quantity))
//         .then(() => {
//             res.status(201).json({ message: `Product id ${productId} added to Cart id ${cartId}!😎` });
//         })
//         .catch(error => {
//             res.status(500).json({ error: 'Error adding product to cart' });
//         });
// });

// export default router;