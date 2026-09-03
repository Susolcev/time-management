const express = require('express');
const mongoose = require('mongoose');

const TimeEntry = require('../models/TimeEntry');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const entries = await TimeEntry.find({
            userId: req.user.id
        })
            .populate('projectId', 'name')
            .sort({
                createdAt: -1
            });

        const result = entries.map((entry) => ({
            id: entry._id.toString(),
            project_id: entry.projectId?._id?.toString(),
            project_name: entry.projectId?.name || 'Проект удалён',
            description: entry.description,
            started_at: entry.startedAt,
            ended_at: entry.endedAt,
            duration: entry.duration,
            createdAt: entry.createdAt
        }));

        res.json(result);
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
            projectId,
            description,
            startedAt,
            endedAt,
            duration
        } = req.body;

        if (
            !projectId ||
            !startedAt ||
            !endedAt ||
            !duration
        ) {
            return res.status(400).json({
                message: 'Необходимо заполнить данные учёта времени'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: 'Неверный ID проекта'
            });
        }

        const project = await Project.findOne({
            _id: projectId,
            userId: req.user.id
        });

        if (!project) {
            return res.status(404).json({
                message: 'Проект не найден'
            });
        }

        const entry = await TimeEntry.create({
            userId: req.user.id,
            projectId,
            description: description || '',
            startedAt,
            endedAt,
            duration
        });

        res.status(201).json({
            id: entry._id.toString(),
            project_id: entry.projectId.toString(),
            project_name: project.name,
            description: entry.description,
            started_at: entry.startedAt,
            ended_at: entry.endedAt,
            duration: entry.duration
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Ошибка сервера'
        });
    }
});

module.exports = router;