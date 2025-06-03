import {lazy, Suspense} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css'
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./pages/user/DashboardLayout.jsx";
import AuthProvider from "./services/AuthProvider.jsx";

// Lazy load the components
const Welcome = lazy(() => import("./pages/Welcome.jsx"))
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Register = lazy(() => import("./pages/auth/Register.jsx"));
const Dashboard = lazy(() => import("./pages/user/Dashboard.jsx"))
const Transactions = lazy(() => import("./pages/user/Transactions.jsx"));
const Settings = lazy(() => import("./pages/user/Settings.jsx"));
const Categories = lazy(() => import("./pages/user/Categories.jsx"));

export default function App() {

    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>

                <Routes>
                    <Route path="/" element={<Welcome/>}/>
                    <Route path="/auth/login" element={<Login/>}/>
                    <Route path="/auth/register" element={<Register/>}/>


                    {/* Routes that require authentication */}
                    <Route path="/user" element={
                        <AuthProvider><ProtectedRoute><DashboardLayout/></ProtectedRoute></AuthProvider>
                    }>
                        <Route path="dashboard" element={<Dashboard/>}/>
                        <Route path="transactions" element={<Transactions/>}/>
                        <Route path="settings" element={<Settings/>}/>
                        <Route path="categories" element={<Categories/>}/>
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    )
}
