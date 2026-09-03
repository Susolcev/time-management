const express = require('express');
const mongoose = require('mongoose');

const Project = require('../models/Project');
const TimeEntry = require('../models/TimeEntry');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const formatProject = (project) => ({
    id: project._id.toString(),
    name: project.name,
    description: project.description,
    color: project.color,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find({
            userId: req.user.id
        }).sort({
            createdAt: -1
        });

        res.json(
            projects.map((project) =>
                formatProject(project)
            )
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка сервера'
        });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const {
            name,
            description,
            color
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: 'Введите название проекта'
            });
        }

        const project = await Project.create({
            userId: req.user.id,
            name,
            description: description || '',
            color: color || '#4f6db8'
        });

        res.status(201).json(
            formatProject(project)
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка сервера'
        });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Неверный ID проекта'
            });
        }

        const project = await Project.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!project) {
            return res.status(404).json({
                message: 'Проект не найден'
            });
        }

        res.json(
            formatProject(project)
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка сервера'
        });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Неверный ID проекта'
            });
        }

        const {
            name,
            description,
            color
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: 'Введите название проекта'
            });
        }

        const project = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                name,
                description: description || '',
                color: color || '#4f6db8'
            },
            {
                new: true
            }
        );

        if (!project) {
            return res.status(404).json({
                message: 'Проект не найден'
            });
        }

        res.json(
            formatProject(project)
        );
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка сервера'
        });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Неверный ID проекта'
            });
        }

        const project = await Project.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!project) {
            return res.status(404).json({
                message: 'Проект не найден'
            });
        }

        await TimeEntry.deleteMany({
            projectId: project._id,
            userId: req.user.id
        });

        await Project.deleteOne({
            _id: project._id
        });

        res.json({
            message: 'Проект удалён'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка сервера'
        });
    }
});

module.exports = router;