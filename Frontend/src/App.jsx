import { Navigate, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from './features/auth/authSlice';

// --- Page Imports ---
import FrontPage from "./Pages/FrontPage";
import Login from "./features/auth/Login";
import SignUp from "./features/auth/SignUp";
import Home from "./Pages/Home";
import ProblemPage from "./features/problems/ProblemPage";
import ContestsPage from "./Pages/ContestsPage";
import ContestDetailPage from "./Pages/ContestDetailPage";
import DiscussPage from "./Pages/DiscussPage";
import Setting from "./Pages/SettingPage"
import ProfilePage from "./Pages/Profile";
import Codefield from "./Pages/CodeField";
import AboutPage from "./Pages/AboutPage";
import TermsPage from "./Pages/TermsPage";
import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage";
import CookiePolicyPage from "./Pages/CookiePolicyPage";
import CreateDiscussPost from "./features/discuss/CreateDiscussPost"
import DiscussPostDetail from "./features/discuss/DiscussPostDetail"

// --- Component Imports ---
import Loading from "./components/common/Loading";
import AdminRoute from "./route/AdminRoute";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// --- Admin Panel Imports ---
import AdminLayout from "./Pages/AdminLayout"; // UPDATED
import AdminDashboardPage from "./Pages/AdminDashboardPage"; // NEW
import AdminUsersPage from "./Pages/AdminUsersPage"; // NEW
import AdminSiteSettingsPage from "./Pages/AdminSiteSettingsPage"; // NEW
import ProblemList from "./features/problems/ProblemList";
import CreateProblem from "./features/problems/CreateProblem";
import EditProblem from "./features/problems/EditProblem";


const App = () => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <ToastContainer theme="dark" position="top-right" />
            <Routes>
                {/* --- Public & User Routes --- */}
                <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <FrontPage />} />
                <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <SignUp />} />
                <Route path="/problems" element={isAuthenticated ? <ProblemPage /> : <Navigate to="/" />} />
                <Route path="/contests" element={isAuthenticated ? <ContestsPage /> : <Navigate to="/" />} />
                <Route path="/contests/:slug" element={isAuthenticated ? <ContestDetailPage /> : <Navigate to="/" />} />
                <Route path="/discuss" element={isAuthenticated ? <DiscussPage /> : <Navigate to="/" />} />
                <Route path="/discuss/new" element={isAuthenticated ? <CreateDiscussPost /> : <Navigate to="/" />} />
                <Route path="/discuss/:slug" element={isAuthenticated ? <DiscussPostDetail /> : <Navigate to="/" />} />
                <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />} />
                <Route path="/profile/:userId" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />} />
                <Route path="/settings" element={isAuthenticated ? <Setting /> : <Navigate to="/" />} />
                <Route path="/codefield/:problemId" element={isAuthenticated ? <Codefield /> : <Navigate to="/" />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/cookies" element={<CookiePolicyPage />} />

                {/* --- Admin Routes --- */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="users" element={<AdminUsersPage />} />
                        <Route path="problems" element={<ProblemList />} />
                        <Route path="problems/create" element={<CreateProblem />} />
                        <Route path="problems/edit/:id" element={<EditProblem />} />
                        <Route path="settings" element={<AdminSiteSettingsPage />} />
                    </Route>
                </Route>

            </Routes>
        </>
    );
};

export default App;