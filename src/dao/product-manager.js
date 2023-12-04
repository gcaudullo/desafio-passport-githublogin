import fs from 'fs';
import { json } from 'stream/consumers'
// const fs = require('fs');
// const { json } = require();
export default class ProductManager {
    constructor(path) {
        this.path = path;
        this.counter = 1;
        this.initializeIdCounter();
    }

    async initializeIdCounter() {
        try {
            const products = await getJsonFromFile(this.path);
            if (products.length > 0) {
                // Encuentra el máximo ID actualmente utilizado
                const maxId = Math.max(...products.map(product => product.id));
                this.counter = maxId + 1; // Establece el contador al siguiente ID disponible
            }
        } catch (error) {
            console.error('Error initializing ID counter:', error);
        }
    }

    // Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado,
    // asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).

    async addProduct(productData) {
        const { title, description, code, price, status, stock, category, thumbnails } = productData;

        if (!title, !description, !code, !price, !status, !stock, !category) {
            console.error('The title, description, code, price, status, stock and category fields are required 🎯');
            return;
        }
        try {
            const products = await getJsonFromFile(this.path);
            const existingProduct = products.find(product => product.code === code);
            if (existingProduct) {
                console.error(`There is already a product with that code ${code}`);
                return;
            } else {
                const newProduct = {
                    id: this.counter,
                    title,
                    description,
                    code,
                    price,
                    status: true,
                    stock,
                    category,
                    thumbnails: thumbnails || [] // Si no se proporciona thumbnails, establece un array vacío

                }
                this.counter++
                products.push(newProduct)
                await saveJsonInFile(this.path, products)
                console.log(`The product with code ${code} was added 😎`)
            }
        } catch (error) {
            console.error('Error adding product:', error)
        }
    }

    // Debe tener un método getProducts, el cual debe leer el archivo de productos y
    // devolver todos los productos en formato de arreglo.
    async getProducts() {
        try {
            return getJsonFromFile(this.path)
        } catch (error) {
            console.error(error)
        }

    }

    // Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo,
    // // debe buscar el producto con el id especificado y devolverlo en formato objeto
    async getProductById(productId) {
        try {
            const products = await getJsonFromFile(this.path)
            const product = products.find(product => product.id === productId);
            if (!product) {
                return `Product with id ${productId} Not found! 😨`;
            } else {
                return product
            }
        } catch (error) {
            console.error(error)
        }

    }

    // Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar,
    // así también como el campo a actualizar (puede ser el objeto completo, como en una DB),
    // y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID
    async updateProduct(id, data) {
        const { title, description, code, price, status, stock, category, thumbnails } = data;
        const products = await getJsonFromFile(this.path);
        const position = products.findIndex((u) => u.id === id);
        if (position === -1) {
            console.error(`Product id ${id} not found 😨`);
            return;
        }
        if (title) {
            products[position].title = title;
        }
        if (description) {
            products[position].description = description;
        }
        if (code) {
            products[position].code = code;
        }
        if (price) {
            products[position].price = price;
        }
        if (status) {
            products[position].status = status;
        }
        if (stock) {
            products[position].stock = stock;
        }
        if (category) {
            products[position].category = category;
        }
        if (thumbnails) {
            products[position].thumbnail = thumbnail;
        }
        await saveJsonInFile(this.path, products);
        console.log(`Product id ${id} updated! 😎`);
    }


    // Debe tener un método deleteProduct, el cual debe recibir un id y
    // debe eliminar el producto que tenga ese id en el archivo.
    async deleteProduct(id) {
        const products = await getJsonFromFile(this.path);
        const position = products.findIndex((product) => product.id === id);
        if (position >= 0) {
            products.splice(position, 1);
            await saveJsonInFile(this.path, products);
            console.log(`Product id ${id} deleted! 😎`);
        } else {
            console.log('There is no product with that Id')
        }

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
    //Creo una instancia de la clase “ProductManager”
    const productManager = new ProductManager('./products.json');
    const product1 = {
        "title": 'Apple Ipad 10 9 10th',
        "description": 'Tablet de ultima generación',
        "code": 5698,
        "price": 959,
        "status": true,
        "stock": 20,
        "category": 'Tablet',
        "thumbnails": ['./img/cel-tecno/apple-ipad-10-9-10th-gen-wifi-1', './img/cel-tecno/apple-ipad-10-9-10th-gen-wifi-2']
    }
    await productManager.addProduct(product1)

    const product2 = {
        "title": 'Cel Samsung Galaxy A04',
        "description": 'Uno de los celulares mas venididos del 2022',
        "code": 5699,
        "price": 179,
        "status": true,
        "stock": 20,
        "category": 'Celular',
        "thumbnails": ['./img/cel-tecno/cel-samsung-galaxy-a04-1', './img/cel-tecno/cel-samsung-galaxy-a04-2']
    }
    await productManager.addProduct(product2);
    const product3 = {
        "title": 'Cel Xiaomi Redmi 10a',
        "description": 'Uno de los celulares mas venididos del 2021',
        "code": 5700,
        "price": 153,
        "status": true,
        "stock": 20,
        "category": 'Celular',
        "thumbnails": ['./img/cel-tecno/xiaomi-redmi-10a-1', './img/cel-tecno/xiaomi-redmi-10a-2']
    }
    await productManager.addProduct(product3);
    
    const product4 = {
        "title": 'ASUS Vivobook m513ia bq322t',
        "description": 'Computador portatil de gran performace',
        "code": 5701,
        "price": 800,
        "status": true,
        "stock": 10,
        "category": 'Notebook',
        "thumbnails": ['./img/notebooks/asus-vivobook-m513ia-1', './img/notebooks/asus-vivobook-m513ia-2']
    }
    await productManager.addProduct(product4);
    
    const product5 = {
        "title": 'HP-14\" dq2088wm HD Core i5',
        "description": 'Computador portatil de gran procesador',
        "code": 5702,
        "price": 849,
        "status": true,
        "stock": 10,
        "category": 'Notebook',
        "thumbnails": ['./img/notebooks/hp-14-dq2088wm']
    }
    await productManager.addProduct(product5);
   
    const product6 = {
        "title": 'Enxuta smart tv 24\" ledenx1224d1k',
        "description": 'TV Smart la mas vendida de 2022',
        "code": 5703,
        "price": 134,
        "status": true,
        "stock": 10,
        "category": 'TV&Video',
        "thumbnails": ['./img/tv-video/enxuta-smart-tv-24-ledenx1224d1k']
    }
    await productManager.addProduct(product6);
    
    const product7 = {
        "title": 'JBL wave 300 tws headphone',
        "description": 'Excelentes auriculares',
        "code": 5704,
        "price": 89,
        "status": true,
        "stock": 20,
        "category": 'TV&Video',
        "thumbnails": ['./img/tv-video/jbl-wave-300-tws']
    }
    await productManager.addProduct(product7);
    
    const product8 = {
        "title": 'Minicomponente LG Cl88',
        "description": 'Gran potencia de sonido',
        "code": 5705,
        "price": 780,
        "status": true,
        "stock": 10,
        "category": 'TV&Video',
        "thumbnails": ['./img/tv-video/minicomponente-lg-cl88']
    }
    await productManager.addProduct(product8);
    
    const product9 = {
        "title": 'Nintendo Switch Oled 64gb',
        "description": 'La mejor Consola de Nintendo',
        "code": 5706,
        "price": 800,
        "status": true,
        "stock": 20,
        "category": 'TV&Video',
        "thumbnails": ['./img/tv-video/nintendo-switch-oled-64gb']
    }
    await productManager.addProduct(product9);
    
    const product10 = {
        "title": 'Smart TV LG 55\" oled oled55c2psa',
        "description": 'TV de ultima generación',
        "code": 5707,
        "price": 2849,
        "status": true,
        "stock": 10,
        "category": 'TV&Video',
        "thumbnails": []
    }
    await productManager.addProduct(product10);

    // console.log('Ejecuto getProducts');
    // await productManager.getProducts()
    //     .then(products => {
    //         console.log(products);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });

    // // // Pruebo traer un producto de id inexistente
    // await productManager.getProductById(15)
    //     .then(product => {
    //         console.log('Product By Id:', product);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
    // // // Pruebo traer un producto de id existente
    // await productManager.getProductById(3)
    //     .then(product => {
    //         console.log('Product By Id:', product);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });

    // const data = {
    //     id: 1,
    //     title: 'Prueba 1',
    //     description: 'Ningun',
    //     price: 100000000,
    //     thumbnail: 'no tengo',
    //     code: 2315,
    //     stock: 0
    // }
    // await productManager.updateProduct(1, data)

    // console.log('Ejecuto getProducts');
    // await productManager.getProducts()
    //     .then(products => {
    //         console.log(products);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });

    // await productManager.deleteProduct(1);

    // console.log('Ejecuto getProducts');
    // await productManager.getProducts()
    //     .then(products => {
    //         console.log(products);
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
}

// test();

// Exporta la clase ProductManager para que esté disponible en otros archivos
// export default ProductManager;
