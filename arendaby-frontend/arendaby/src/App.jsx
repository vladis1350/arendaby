import './App.css';
import React, {Component} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import City from "./pages/city/city";
import Apartment from "./pages/apartment/apartment";


function Logout() {
    localStorage.clear()
    return <Navigate to="/login"/>
}

function RegisterAndLogout() {
    localStorage.clear()
    return <Register/>
}

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/logout" element={<Logout/>}/>
                    <Route path="/register" element={<RegisterAndLogout/>}/>
                    <Route path="/country/:country/:id" element={<City/>}/>
                    <Route path="/apartment/city/:city" element={<Apartment/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;
