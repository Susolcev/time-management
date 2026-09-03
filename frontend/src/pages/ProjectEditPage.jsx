import {
    useEffect,
    useState
} from 'react';

import {
    useNavigate,
    useParams
} from 'react-router-dom';

import { useSelector } from 'react-redux';

import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';

function ProjectEditPage() {
    const { id } = useParams();

    const navigate = useNavigate();

    const token = useSelector(
        (state) => state.auth.token
    );

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#4f6db8');

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProject = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/projects/${id}`,
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

                setName(data.name);
                setDescription(data.description);
                setColor(data.color);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadProject();
    }, [id, token]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setIsSaving(true);

        try {
            const response = await fetch(
                `http://localhost:3000/api/projects/${id}`,
                {
                    method: 'PUT',
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
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <div className="page-heading">
                <div>
                    <h1>Редактирование проекта</h1>

                    <p>
                        Измените данные выбранного проекта
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
                            disabled={isSaving}
                        >
                            {isSaving
                                ? 'Сохранение...'
                                : 'Сохранить'}
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

export default ProjectEditPage;