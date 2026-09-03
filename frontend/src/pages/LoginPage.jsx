import { useState } from 'react';
import {
    Link,
    useNavigate
} from 'react-router-dom';

import {
    useDispatch
} from 'react-redux';

import Input from '../components/Input';
import Button from '../components/Button';

import {
    login
} from '../store/authSlice';

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                'http://localhost:3000/api/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            dispatch(
                login({
                    user: data.user,
                    token: data.token
                })
            );

            navigate('/');
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
                        Войдите в аккаунт, чтобы продолжить
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
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
                            placeholder="Введите пароль"
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
                            ? 'Вход...'
                            : 'Войти'}
                    </Button>
                </form>

                <div className="auth-card__footer">
                    <span>
                        Нет аккаунта?
                    </span>

                    <Link to="/register">
                        Зарегистрироваться
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;