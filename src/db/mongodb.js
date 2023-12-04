import mongoose from 'mongoose';

export const URI = 'mongodb+srv://developer:EDadBkoCqBjXywzi@cluster0.cikumxo.mongodb.net/ecommerce?retryWrites=true&w=majority';


// const URI = 'mongodb://localhost:27017/school';


export const init2 = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Database connected susscessfully 🚀');
  } catch (error) {
    console.error('Ocurrio un error al intenter conectarnos a la base de datos 😨.', error.message);
  }
}
