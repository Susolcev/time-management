import { useState } from 'react';
import {
    Link,
    useNavigate
} from 'react-router-dom';

import Input from '../components/Input';
import Button from '../components/Button';

function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(
                'http://localhost:3000/api/auth/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
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

            navigate('/login');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-card__header">
                    <h1>TimeManager</h1>

                    <p>
                        Создайте аккаунт для учёта рабочего времени
                    </p>
                </div>

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
                            label="Пароль"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Придумайте пароль"
                            required
                        />
                    </div>

                    {error && (
                        <div className="message message--error">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? 'Регистрация...'
                            : 'Зарегистрироваться'}
                    </Button>
                </form>

                <div className="auth-card__footer">
                    <span>
                        Уже есть аккаунт?
                    </span>

                    <Link to="/login">
                        Войти
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;