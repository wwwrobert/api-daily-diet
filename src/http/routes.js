const app = require('express')(); 
const { userRoutes } = require('./controllers/routesUsers');
const { mealRoutes } = require('./controllers/routesMeals');
// const authenticateToken = require('./middleware/authenticate');

// routes users
app.post('/user', userRoutes);

// routes meals
app.post('/meals', mealRoutes);

app.get('/meals/:userId', mealRoutes)

app.get('/meals/:mealId', mealRoutes)

app.get('/user-metrics/:userId', mealRoutes)

app.put('/meals/:mealId', mealRoutes)

app.delete('/meals/:mealId', mealRoutes)

module.exports = app;  

