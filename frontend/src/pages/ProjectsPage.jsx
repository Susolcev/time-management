import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Button from '../components/Button';

function ProjectsPage() {
    const token = useSelector((state) => state.auth.token);

    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

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

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm(
            'Удалить этот проект?'
        );

        if (!isConfirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:3000/api/projects/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setProjects((currentProjects) =>
                currentProjects.filter(
                    (project) => project.id !== id
                )
            );
        } catch (error) {
            setError(error.message);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <div className="page-heading">
                <div>
                    <h1>Проекты</h1>

                    <p>
                        Создавайте проекты и отслеживайте
                        затраченное на них время
                    </p>
                </div>

                <Link
                    className="button"
                    to="/projects/create"
                >
                    Создать проект
                </Link>
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
                        Создайте первый проект, чтобы начать
                        учитывать время.
                    </p>

                    <Link
                        className="button"
                        to="/projects/create"
                    >
                        Создать проект
                    </Link>
                </div>
            ) : (
                <div className="projects-grid">
                    {projects.map((project) => (
                        <div
                            className="project-card"
                            key={project.id}
                        >
                            <div
                                className="project-card__color"
                                style={{
                                    backgroundColor:
                                        project.color
                                }}
                            />

                            <div className="project-card__content">
                                <h2>
                                    {project.name}
                                </h2>

                                <p>
                                    {project.description ||
                                        'Описание не указано'}
                                </p>

                                <div className="project-card__actions">
                                    <Link
                                        className="button"
                                        to={`/projects/${project.id}/edit`}
                                    >
                                        Редактировать
                                    </Link>

                                    <Button
                                        onClick={() =>
                                            handleDelete(
                                                project.id
                                            )
                                        }
                                    >
                                        Удалить
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProjectsPage;