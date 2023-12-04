import { Server } from 'socket.io';
import ProductsManager from './dao/product.manager.js';
import MessageModel from './dao/models/messages.model.js';

export const init = (httpServer) => {
  const io = new Server(httpServer);

  io.on('connection', async (socketClient) => {
    try {
      // Enviar la lista de productos cuando un cliente se conecta
      console.log('Cliente conectado: ', socketClient.id);
      const products = await ProductsManager.getProducts({}, {});
      socketClient.emit('listOfProducts', products.docs);

      //Cargo y envio la lista de mensajes
      const messages = await MessageModel.find({});
      socketClient.emit('update-messages', messages);

      //
      socketClient.on('new-message', async (msg) => {
        await MessageModel.create(msg);
        const messages = await MessageModel.find({});
        io.emit('update-messages', messages);
      });

      socketClient.on('addProduct', async (productData) => {
        // Lógica para agregar el producto a través de WebSocket
        await ProductsManager.addProduct(productData);

        // Obtén la lista actualizada de productos
        const updatedProducts = await ProductsManager.getProducts();

        // Emite la lista actualizada a través de WebSockets
        io.emit('productAdded', productData);
        io.emit('listOfProducts', updatedProducts);
      });

      socketClient.on('deleteProduct', async (productId) => {
        // Lógica para eliminar un producto a través de WebSocket
        await ProductsManager.deleteProduct(productId);

        // Obtén la lista actualizada de productos
        const updatedProducts = await ProductsManager.getProducts();

        // Emite la lista actualizada a través de WebSockets
        io.emit('productDeleted', productId);
        io.emit('listOfProducts', updatedProducts);
      });

      socketClient.on('disconnect', () => {
        console.log('Cliente desconectado: ', socketClient.id);
      });
    } catch (error) {
      console.error('Error en la conexión del cliente:', error);
    }
  });
};

// const productManager = new ProductManager('./products.json');

// export const init = (httpServer) => {
//   const io = new Server(httpServer);

//   io.on('connection', async (socketClient) => {
//     try {
//       // Enviar la lista de productos cuando un cliente se conecta
//       console.log('Cliente conectado: ', socketClient.id);
//       const products = await productManager.getProducts();
//       socketClient.emit('listOfProducts', products);

//       socketClient.on('addProduct', async (productData) => {
//         // Lógica para agregar el producto a través de WebSocket
//         await productManager.addProduct(productData);

//         // Obtén la lista actualizada de productos
//         const updatedProducts = await productManager.getProducts();

//         // Emite la lista actualizada a través de WebSockets
//         io.emit('productAdded', productData);
//         io.emit('listOfProducts', updatedProducts);
//       });

//       socketClient.on('deleteProduct', async (productId) => {
//         // Lógica para eliminar un producto a través de WebSocket
//         await productManager.deleteProduct(parseInt(productId));

//         // Obtén la lista actualizada de productos
//         const updatedProducts = await productManager.getProducts();

//         // Emite la lista actualizada a través de WebSockets
//         io.emit('productDeleted', productId);
//         io.emit('listOfProducts', updatedProducts);
//       });

//       socketClient.on('disconnect', () => {
//         console.log('Cliente desconectado: ', socketClient.id);
//       });
//     } catch (error) {
//       console.error('Error en la conexión del cliente:', error);
//     }
//   });
// };
