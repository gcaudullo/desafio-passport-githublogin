import ProductsManager from '../dao/product.manager.js';
import express from 'express';
import {buildResponsePaginated} from '../utils.js';
const router = express.Router();



router.get('/products', async (req, res) => {
    const { limit = 10, page = 1, sort, category } = req.query;
    // sort es por precio, posibles valores asc/desc
    // search es por category
    const criteria = {};
    const options = { limit, page }
    if (sort) {
        options.sort = { price: sort };
    }
    if (category) {
        criteria.category = category;
    }
    try {
        const products = await ProductsManager.getProducts(criteria, options);
        res.status(200).json(buildResponsePaginated({...products, sort, category}));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obtaining products.' });
    }
});

// router.get('/products', async (req, res) => {
//     const { query } = req;
//     const { limit } = query;

//     try {
//         const products = await ProductsManager.getProducts(parseInt(limit));
//         res.status(200).json(products);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error obtaining products.' });
//     }
// });

router.get('/products/:pId', async (req, res) => {
    const { pId } = req.params;

    try {
        const product = await ProductsManager.getProductById(pId);
        if (!product) {
            res.status(404).json({ error: 'Product not found! 😨' });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obtaining product.' });
    }
});

router.post('/products', async (req, res) => {
    try {
        const newProduct = await ProductsManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding product.' });
    }
});

router.put('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const productData = req.body;

    try {
        await ProductsManager.updateProduct(pid, productData);
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating product' });
    }
});

router.delete('/products/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        await ProductsManager.deleteProduct(pid);
        res.status(200).json({ message: 'Product successfully removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting product' });
    }
});

export default router;


// router.get('/products', (req, res) => {
//     const { query } = req;
//     const { limit } = query;
//     productManager.getProducts()
//         .then(products => {
//             if (!limit) {
//                 res.status(200).json(products);
//             } else {
//                 const result = products.slice(0, parseInt(limit));
//                 res.status(200).json(result);
//             }
//         })
//         .catch(error => {
//             console.error(error);
//         });
// });

// router.get('/products/:pId', (req, res) => {
//     const { pId } = req.params;
//     productManager.getProductById(parseInt(pId))
//         .then(product => {
//             if (product === 'Product Not found! 😨') {
//                 res.status(404).json({ error: 'Product Not found! 😨' });
//             } else {
//                 res.status(200).json(product);
//             }
//         })
//         .catch(error => {
//             console.error(error);
//             res.status(500).json({ error: 'Error obtaining product.' });
//         });
// });

// router.post('/products', (req, res) => {
//     productManager.addProduct(req.body)
//         .then(() => {
//             res.status(201).json(req.body);
//         })
//         .catch(error => {
//             console.error(error);
//             res.status(500).json({ error: 'Error adding product.' });
//         });
// });

// router.put('/products/:pid', (req, res) => {
//     const { pid } = req.params; // Obtiene el ID del producto de la URL
//     const productData = req.body; // Obtiene los datos a actualizar desde el cuerpo de la solicitud

//     // Llama al método updateProduct de ProductManager para actualizar el producto
//     productManager.updateProduct(parseInt(pid), productData)
//         .then(() => {
//             res.status(200).json({ message: 'Product updated successfully' });
//         })
//         .catch(error => {
//             res.status(500).json({ error: 'Error updating product' });
//         });
// });

// router.delete('/products/:pid', (req, res) => {
//     const { pid } = req.params; // Obtiene el ID del producto de la URL

//     // Llama al método deleteProduct de ProductManager para eliminar el producto
//     productManager.deleteProduct(parseInt(pid))
//         .then(() => {
//             res.status(200).json({ message: 'Product successfully removed' });
//         })
//         .catch(error => {
//             res.status(500).json({ error: 'Error deleting product' });
//         });
// });

// export default router;