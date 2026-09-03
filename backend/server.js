require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectMongoDB = require('./database/mongo');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const timeEntriesRoutes = require('./routes/timeEntries');
const profileRoutes = require('./routes/profile');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/time-entries', timeEntriesRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
    res.send('Time Manager API работает!');
});

const startServer = async () => {
    await connectMongoDB();

    app.listen(PORT, () => {
        console.log(`Сервер запущен: http://localhost:${PORT}`);
    });
};

startServer();