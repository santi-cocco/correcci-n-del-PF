import express from 'express';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

import routerP from './routes/products.router.js';
import routerV from './routes/views.router.js';
import routerC from './routes/carts.router.js';  
import socketProducts from './listeners/socketProducts.js';
import connectToDB from './Dao/config/db.js';

const app = express();
const PORT = 8080;

app.use(express.static(__dirname + '/public'));

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Rutas
app.use('/api/products', routerP);
app.use('/api/carts', routerC);  
app.use('/', routerV);

connectToDB()
const httpServer = app.listen(PORT, () => {
  try {
    console.log(`Listening to the port ${PORT}\nAcceder a:`);
    console.log(`\t1). http://localhost:${PORT}/api/products`);
    console.log(`\t2). http://localhost:${PORT}/api/carts`);
  } catch (err) {
    console.log(err);
  }

});

const socketServer = new Server(httpServer);


socketProducts(socketServer);

