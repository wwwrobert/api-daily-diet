const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { buildRoutePath } = require('../../utils/build-route-path.js');

const mealRoutes = [

  // create meal  
  {
    method: 'POST',
    path: buildRoutePath('/meals'), 
    handler: async (req, res) => {
      const { name, description, dateTime, isInDiet, userId } = req.body;

      try {
        if (!name || !dateTime || userId === undefined) {
          return res.status(400).json({ message: 'Nome, dateTime e userId são obrigatórios.' });
        }

        const meal = await prisma.meal.create({
          data: {
            name,
            description,
            dateTime,
            isInDiet,
            userId,
          },
        });

        res.status(201).json(meal);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro ao criar a refeição.' });
      }
    },
  },

  // get meal user
  {
    method: 'GET',
    path: buildRoutePath('/meals/:userId'), 
    handler: async (req, res) => {
      const { userId } = req.params; 

      try {
        const meals = await prisma.meal.findMany({
          where: {
            userId: userId,
          },
        });

        res.status(200).json(meals);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro ao listar as refeições do usuário.' });
      }
    },
  },

  // get meal unique
  {
    method: 'GET',
    path: buildRoutePath('/meals/:mealId'),
    handler: async (req, res) => {
      const { mealId } = req.params;
      const userId = req.user.id; 

      try {
        const meal = await prisma.meal.findUnique({
          where: {
            id: mealId,
          },
        });

        if (!meal) {
          return res.status(404).json({ message: 'Refeição não encontrada.' });
        }

        if (meal.userId !== userId) {
          return res.status(403).json({ message: 'Você não tem permissão para visualizar esta refeição.' });
        }

        res.status(200).json(meal);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro ao visualizar a refeição.' });
      }
    },
  },

  // get meal metrics
  {
    method: 'GET',
    path: buildRoutePath('/user-metrics/:userId'),
    handler: async (req, res) => {
      const { userId } = req.params;
      const authenticatedUserId = req.user.id;
  
      if (userId !== authenticatedUserId) {
        return res.status(403).json({ message: 'Você não tem permissão para acessar essas métricas.' });
      }
  
      try {
        const totalMeals = await prisma.meal.count({
          where: {
            userId: userId,
          },
        });
  
        const dietMeals = await prisma.meal.count({
          where: {
            userId: userId,
            isInDiet: true,
          },
        });
  
        const nonDietMeals = totalMeals - dietMeals;
  
        const bestDietSequence = await prisma.$queryRaw`
          SELECT COUNT(*) as count
          FROM "Meal"
          WHERE "userId" = ${userId} AND "isInDiet" = true
          GROUP BY EXTRACT(DAY FROM "dateTime")
          ORDER BY COUNT(*) DESC
          LIMIT 1
        `;
  
        const metrics = {
          totalMeals: totalMeals,
          dietMeals: dietMeals,
          nonDietMeals: nonDietMeals,
          bestDietSequence: bestDietSequence[0]?.count || 0,
        };
  
        res.status(200).json(metrics);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro ao recuperar as métricas do usuário.' });
      }
    },
  },

  // update meal 
  {
    method: 'PUT',
    path: buildRoutePath('/meals/:mealId'),
    handler: async (req, res) => {
      const { mealId } = req.params;
      const { name, description, dateTime, isInDiet } = req.body;
      const userId = req.user.id; 
  
      try {
        const meal = await prisma.meal.findUnique({
          where: {
            id: mealId,
          },
        });
  
        if (!meal) {
          return res.status(404).json({ message: 'Refeição não encontrada.' });
        }
  
        if (meal.userId !== userId) {
          return res.status(403).json({ message: 'Você não tem permissão para editar esta refeição.' });
        }
  
        const updatedMeal = await prisma.meal.update({
          where: { id: mealId },
          data: {
            name,
            description,
            dateTime,
            isInDiet,
          },
        });
  
        res.status(200).json(updatedMeal);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro ao editar a refeição.' });
      }
    },
  },

  // delete meal
  {
    method: 'DELETE',
    path: buildRoutePath('/meals/:mealId'),
    handler: async (req, res) => {
      const { mealId } = req.params;
      const userId = req.user.id;
  
      try {
        const meal = await prisma.meal.findUnique({
          where: {
            id: mealId,
          },
        });
  
        if (!meal) {
          return res.status(404).json({ message: 'Refeição não encontrada.' });
        }
  
        if (meal.userId !== userId) {
          return res.status(403).json({ message: 'Você não tem permissão para excluir esta refeição.' });
        }
  
        await prisma.meal.delete({
          where: { id: mealId },
        });
  
        res.status(204).end();
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro ao excluir a refeição.' });
      }
    },
  },
];

module.exports = { mealRoutes };

