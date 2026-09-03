import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Select from '../components/Select';
import AnalyticsChart from '../components/AnalyticsChart';
import Pagination from '../components/Pagination';

function AnalyticsPage() {
    const token = useSelector((state) => state.auth.token);

    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedProject, setSelectedProject] = useState('');
    const [sortType, setSortType] = useState('date-new');
    const [currentPage, setCurrentPage] = useState(1);

    const entriesPerPage = 5;

    useEffect(() => {
        const loadEntries = async () => {
            try {
                const response = await fetch(
                    'http://localhost:3000/api/time-entries',
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

                setEntries(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadEntries();
    }, [token]);

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return [hours, minutes, secs]
            .map((value) => String(value).padStart(2, '0'))
            .join(':');
    };

    const projectNames = [
        ...new Set(
            entries.map((entry) => entry.project_name)
        )
    ];

    const projectOptions = projectNames.map((projectName) => ({
        value: projectName,
        label: projectName
    }));

    const sortOptions = [
        {
            value: 'date-new',
            label: 'Сначала новые'
        },
        {
            value: 'date-old',
            label: 'Сначала старые'
        },
        {
            value: 'time-more',
            label: 'По времени: больше'
        },
        {
            value: 'time-less',
            label: 'По времени: меньше'
        }
    ];

    let filteredEntries = [...entries];

    if (selectedProject) {
        filteredEntries = filteredEntries.filter(
            (entry) => entry.project_name === selectedProject
        );
    }

    filteredEntries.sort((a, b) => {
        if (sortType === 'date-new') {
            return new Date(b.started_at) - new Date(a.started_at);
        }

        if (sortType === 'date-old') {
            return new Date(a.started_at) - new Date(b.started_at);
        }

        if (sortType === 'time-more') {
            return b.duration - a.duration;
        }

        if (sortType === 'time-less') {
            return a.duration - b.duration;
        }

        return 0;
    });

    const totalPages = Math.ceil(
        filteredEntries.length / entriesPerPage
    );

    const startIndex = (currentPage - 1) * entriesPerPage;

    const paginatedEntries = filteredEntries.slice(
        startIndex,
        startIndex + entriesPerPage
    );

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <div className="page-heading">
                <div>
                    <h1>Аналитика</h1>

                    <p>
                        Просматривайте статистику затраченного времени
                    </p>
                </div>
            </div>

            {error && (
                <div className="message message--error">
                    {error}
                </div>
            )}

            <div className="analytics-filters">
                <Select
                    label="Фильтр по проекту"
                    value={selectedProject}
                    onChange={(event) => {
                        setSelectedProject(event.target.value);
                        setCurrentPage(1);
                    }}
                    options={projectOptions}
                />

                <Select
                    label="Сортировка"
                    value={sortType}
                    onChange={(event) => {
                        setSortType(event.target.value);
                        setCurrentPage(1);
                    }}
                    options={sortOptions}
                />
            </div>

            <div className="analytics-section">
                <AnalyticsChart entries={filteredEntries} />
            </div>

            {filteredEntries.length === 0 ? (
                <div className="empty-state">
                    <h2>Записей пока нет</h2>

                    <p>
                        Запустите таймер на главной странице,
                        чтобы здесь появилась статистика.
                    </p>
                </div>
            ) : (
                <div className="analytics-list">
                    {paginatedEntries.map((entry) => (
                        <div
                            className="analytics-entry"
                            key={entry.id}
                        >
                            <div className="analytics-entry__top">
                                <div>
                                    <h3>
                                        {entry.project_name}
                                    </h3>

                                    <p>
                                        {entry.description ||
                                            'Нет описания'}
                                    </p>
                                </div>

                                <div className="analytics-entry__time">
                                    {formatDuration(entry.duration)}
                                </div>
                            </div>

                            <div className="analytics-entry__date">
                                {new Date(entry.started_at)
                                    .toLocaleString('ru-RU')}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}

export default AnalyticsPage;