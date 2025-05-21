import {lazy, Suspense} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css'

// Lazy load the components
const Welcome = lazy(() => import("./pages/Welcome.jsx"))
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Register = lazy(() => import("./pages/auth/Register.jsx"));
const Dashboard = lazy(() => import("./pages/main/Dashboard.jsx"));
const Transactions = lazy(() => import("./pages/main/Transactions.jsx"));

function App() {

    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Welcome/>}/>
                    <Route path="/auth/login" element={<Login/>}/>
                    <Route path="/auth/register" element={<Register/>}/>

                    <Route path="/user/dashboard" element={<Dashboard/>}/>
                    <Route path="/user/transactions" element={<Transactions/>}/>
                </Routes>
            </Suspense>
        </Router>
    )
}

export default App
