import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';

import { setUser } from '../store/authSlice';

function SettingsPage() {
    const dispatch = useDispatch();

    const token = useSelector((state) => state.auth.token);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetch(
                    'http://localhost:3000/api/profile',
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
                setEmail(data.email);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setSuccess('');
        setIsSaving(true);

        try {
            const response = await fetch(
                'http://localhost:3000/api/profile',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            dispatch(setUser(data));

            setPassword('');
            setSuccess('Данные успешно сохранены');
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
                    <h1>Настройки аккаунта</h1>

                    <p>
                        Изменяйте имя, электронную почту и пароль
                    </p>
                </div>
            </div>

            <div className="settings-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <Input
                            label="Имя"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Ваше имя"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="example@mail.ru"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <Input
                            label="Новый пароль"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Оставьте пустым, чтобы не менять"
                        />

                        <p className="form-hint">
                            Если пароль менять не нужно, оставьте поле пустым.
                        </p>
                    </div>

                    {error && (
                        <div className="message message--error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="message message--success">
                            {success}
                        </div>
                    )}

                    <div className="form-actions">
                        <Button
                            type="submit"
                            disabled={isSaving}
                        >
                            {isSaving
                                ? 'Сохранение...'
                                : 'Сохранить изменения'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SettingsPage;