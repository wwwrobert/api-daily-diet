const app = require('express')(); 
const { userRoutes } = require('./controllers/routesUsers');
const { mealRoutes } = require('./controllers/routesMeals');
const authenticateToken = require('./middleware/authenticate');

// routes users
app.post('/user', userRoutes);

// routes meals
app.post('/meals', mealRoutes);

app.get('/search-meals/:userId', mealRoutes)

app.get('/unique-meal/:mealId', mealRoutes)

app.get('/metrics/:userId', mealRoutes)

app.put('/update/:mealId', mealRoutes)

app.delete('/delete/:mealId', mealRoutes)

module.exports = app;  

