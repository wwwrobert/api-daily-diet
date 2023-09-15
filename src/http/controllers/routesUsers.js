const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const router = express.Router();

router.post('/', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Nome obrigatório.' });
  }

  const shortUuid = uuidv4().substr(0, 5);

  try {
    const user = await prisma.user.create({
      data: {
        id: shortUuid,
        username,
      },
    });

    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        id: user.id,
      },
      secret
    );

    res.status(201).json({ user, token }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocorreu um erro ao criar o usuário.' });
  }
});

module.exports = router;
