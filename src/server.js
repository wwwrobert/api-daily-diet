const express = require('express');
const app = express();
const userRoutes = require('./http/controllers/routesUsers');
const mealRoutes = require('./http/controllers/routesMeals');

app.use(express.json());

app.use('/user', userRoutes);
app.use('/meals', mealRoutes);
app.use('/search-meals', mealRoutes);
app.use('/unique-meal', mealRoutes);
app.use('/metrics', mealRoutes);
app.use('/update', mealRoutes);
app.use('/delete', mealRoutes);


const PORT = 3333;
app.listen(PORT, () => {
  console.log('Servidor online...');
});
