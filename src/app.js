import express, { urlencoded } from 'express';
import path from 'path';
import { __dirname } from './utils.js';
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import viewsRouter from './routers/views.router.js';
import sessionRouter from './routers/sessions.router.js';
import handlebars from 'express-handlebars';
import passport from 'passport';
import sessions from 'express-session';
import MongoStore from 'connect-mongo';
import { URI } from './db/mongodb.js';
import { init as initPassport} from './config/passport.config.js';
import cookieParse from 'cookie-parser';

const app = express();
// const SESSION_SECRET = 'Ma0(Q~6]R859oV)ws*)#Yks"£S6Y`f<j';
// app.use(sessions({
//   store: MongoStore.create({
//     mongoUrl: URI,
//     mongoOptions: {},
//     ttl: 120,
//   }),
//   secret: SESSION_SECRET,
//   resave: true,
//   saveUninitialized: true,
// }));

app.use(cookieParse())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// Configuración de Handlebars
const hbs = handlebars.create({
  // ... otras configuraciones ...
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});
app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

initPassport();
app.use(passport.initialize());
//esta linea hay que cometarla al usar JWT
//app.use(passport.session());


app.use('/api', productsRouter, cartsRouter, sessionRouter);
app.use('/views', viewsRouter);

app.use((error, req, res, next) => {
  const message = `Ah ocurrido un error deconocido 🎃: ${error.message}`
  console.error(message);
  res.status(500).json({ message });
})

export default app;





