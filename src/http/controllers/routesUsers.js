const { v4: uuidv4 } = require('uuid');
const { buildRoutePath } = require('../../utils/build-route-path.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const userRoutes = [
  {
    method: 'POST',
    path: buildRoutePath('/user'),
    handler: async (req, res) => {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({ message: 'O nome é obrigatório.' });
      }

      const shortUuid = uuidv4().substr(0, 5);

      try {
        const user = await prisma.user.create({
          data: {
            id: shortUuid,
            username,
          },
        });

        res.status(201).json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro ao criar o usuário.' });
      }
    },
  },
];

module.exports = { userRoutes };
