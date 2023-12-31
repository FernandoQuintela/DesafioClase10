const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const viewsPath = path.join(__dirname, 'views');
app.set('views', viewsPath);
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

let products = [];

app.get('/', (req, res) => {
  res.redirect('/realtimeproducts');
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts.handlebars', { products });
});

app.get('/home', (req, res) => {
  res.render('home', { products });
});

io.on('connection', (socket) => {
  console.log('Usuario conectado');
  socket.emit('updateProducts', products);

  socket.on('addProduct', (productName) => {
    products.push(productName);
    io.emit('updateProducts', products);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
