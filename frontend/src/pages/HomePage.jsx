import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Button from '../components/Button';
import Select from '../components/Select';
import Loader from '../components/Loader';

import useTimer from '../hooks/useTimer';

function HomePage() {
    const token = useSelector((state) => state.auth.token);

    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [description, setDescription] = useState('');
    const [startedAt, setStartedAt] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const {
        seconds,
        isRunning,
        start,
        pause,
        reset
    } = useTimer();

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const response = await fetch(
                    'http://localhost:3000/api/projects',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                setProjects(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadProjects();
    }, [token]);

    const formatTime = (value) => {
        const hours = Math.floor(value / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        const secs = value % 60;

        return [hours, minutes, secs]
            .map((item) => String(item).padStart(2, '0'))
            .join(':');
    };

    const handleStart = () => {
        if (!selectedProjectId) {
            setError('Выберите проект');
            return;
        }

        setError('');

        if (!startedAt) {
            setStartedAt(new Date());
        }

        start();
    };

    const handlePause = () => {
        pause();
    };

    const handleStop = async () => {
        if (!startedAt || seconds === 0) {
            return;
        }

        pause();
        setIsSaving(true);
        setError('');

        try {
            const response = await fetch(
                'http://localhost:3000/api/time-entries',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        projectId: selectedProjectId,
                        description,
                        startedAt: startedAt.toISOString(),
                        endedAt: new Date().toISOString(),
                        duration: seconds
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            reset();
            setDescription('');
            setStartedAt(null);

            alert('Время сохранено');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const projectOptions = projects.map((project) => ({
        value: project.id,
        label: project.name
    }));

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <div className="page-heading">
                <div>
                    <h1>Учёт времени</h1>

                    <p>
                        Выберите проект и запустите таймер
                    </p>
                </div>
            </div>

            {error && (
                <div className="message message--error">
                    {error}
                </div>
            )}

            {projects.length === 0 ? (
                <div className="empty-state">
                    <h2>Проектов пока нет</h2>

                    <p>
                        Сначала создайте проект на странице
                        «Проекты».
                    </p>
                </div>
            ) : (
                <div className="timer-card">
                    <div className="timer-card__field">
                        <Select
                            label="Проект"
                            value={selectedProjectId}
                            onChange={(event) =>
                                setSelectedProjectId(
                                    event.target.value
                                )
                            }
                            options={projectOptions}
                        />
                    </div>

                    <div className="timer-card__field">
                        <label>
                            <span>Описание работы</span>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Что вы сейчас делаете?"
                            />
                        </label>
                    </div>

                    <div className="timer-display">
                        {formatTime(seconds)}
                    </div>

                    <div className="timer-status">
                        {isRunning
                            ? 'Таймер запущен'
                            : startedAt
                                ? 'Таймер на паузе'
                                : 'Таймер не запущен'}
                    </div>

                    <div className="timer-actions">
                        <Button
                            onClick={handleStart}
                            disabled={
                                !selectedProjectId ||
                                isRunning ||
                                isSaving
                            }
                        >
                            {startedAt
                                ? 'Продолжить'
                                : 'Старт'}
                        </Button>

                        <Button
                            onClick={handlePause}
                            disabled={
                                !isRunning ||
                                isSaving
                            }
                        >
                            Пауза
                        </Button>

                        <Button
                            onClick={handleStop}
                            disabled={
                                !startedAt ||
                                seconds === 0 ||
                                isSaving
                            }
                        >
                            {isSaving
                                ? 'Сохранение...'
                                : 'Стоп'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;