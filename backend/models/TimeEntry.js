const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true
        },

        description: {
            type: String,
            default: ''
        },

        startedAt: {
            type: Date,
            required: true
        },

        endedAt: {
            type: Date,
            required: true
        },

        duration: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const TimeEntry = mongoose.model(
    'TimeEntry',
    timeEntrySchema
);

module.exports = TimeEntry;