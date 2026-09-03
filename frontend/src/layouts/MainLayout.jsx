import { useEffect, useState } from 'react';
import {
    NavLink,
    Outlet,
    useNavigate
} from 'react-router-dom';
import {
    useDispatch,
    useSelector
} from 'react-redux';

import Loader from '../components/Loader';
import {
    logout,
    setUser
} from '../store/authSlice';

function MainLayout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector(
        (state) => state.auth.token
    );

    const user = useSelector(
        (state) => state.auth.user
    );

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await fetch(
                    'http://localhost:3000/api/auth/me',
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

                dispatch(setUser(data));
            } catch (error) {
                dispatch(logout());
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, [token, dispatch, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="app">
            <header className="header">
                <div className="header__inner">
                    <NavLink
                        className="logo"
                        to="/"
                    >
                        TimeManager
                    </NavLink>

                    <nav className="nav">
                        <NavLink to="/">
                            Главная
                        </NavLink>

                        <NavLink to="/projects">
                            Проекты
                        </NavLink>

                        <NavLink to="/analytics">
                            Аналитика
                        </NavLink>

                        <NavLink to="/settings">
                            Настройки
                        </NavLink>
                    </nav>

                    <div className="header__user">
                        <span>
                            {user?.name}
                        </span>

                        <button
                            className="button button--secondary"
                            onClick={handleLogout}
                        >
                            Выйти
                        </button>
                    </div>
                </div>
            </header>

            <main className="main">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;