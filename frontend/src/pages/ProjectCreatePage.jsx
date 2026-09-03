import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Input from '../components/Input';
import Button from '../components/Button';

function ProjectCreatePage() {
    const navigate = useNavigate();

    const token = useSelector(
        (state) => state.auth.token
    );

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#4f6db8');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(
                'http://localhost:3000/api/projects',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        description,
                        color
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            navigate('/projects');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="page-heading">
                <div>
                    <h1>Создание проекта</h1>

                    <p>
                        Укажите основные данные нового проекта
                    </p>
                </div>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <Input
                            label="Название проекта"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Например: Дипломная работа"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <span>Описание</span>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Краткое описание проекта"
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <Input
                            label="Цвет проекта"
                            type="color"
                            value={color}
                            onChange={(event) =>
                                setColor(event.target.value)
                            }
                        />
                    </div>

                    {error && (
                        <div className="message message--error">
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? 'Создание...'
                                : 'Создать проект'}
                        </Button>

                        <Button
                            onClick={() =>
                                navigate('/projects')
                            }
                        >
                            Отмена
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProjectCreatePage;