const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            '-password'
        );

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка сервера'
        });
    }
});

router.put('/', authMiddleware, async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: 'Имя и email обязательны'
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase(),
            _id: {
                $ne: req.user.id
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Этот email уже используется'
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        user.name = name;
        user.email = email.toLowerCase();

        if (password) {
            user.password = await bcrypt.hash(
                password,
                10
            );
        }

        await user.save();

        res.json({
            id: user._id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка сервера'
        });
    }
});

module.exports = router;