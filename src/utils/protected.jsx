import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from "react-router-dom";
import { selectCurrentToken } from '../services/authSlice';

const Protected = ({ path="/login", children }) => {

    const token = useSelector(selectCurrentToken);
    const location = useLocation();
    // console.log(token)

    return (
        token ? 
        <>{children}</>: 
        <Navigate to = { path } state= {{ from: location }} replace />
    )
}
export default Protected;