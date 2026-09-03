import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import ProjectCreatePage from './pages/ProjectCreatePage';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectEditPage from './pages/ProjectEditPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <MainLayout />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<HomePage />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route
                        path="projects/create"
                        element={<ProjectCreatePage />}
                    />
                    <Route
                        path="projects/:id/edit"
                        element={<ProjectEditPage />}
                    />
                    <Route
                        path="analytics"
                        element={<AnalyticsPage />}
                    />
                    <Route
                        path="settings"
                        element={<SettingsPage />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;