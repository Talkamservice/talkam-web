import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

//This HOC checks if user is authenticated
//if not, component is not rendered

export function WithAuth(WrappedComponent) {
    // Try to create a nice displayName for React Dev Tools.
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    // Creating the inner component. The calculated Props type here is the where the magic happens.
    const ComponentwithAuth = (props) => {

        const [isUser, setIsUser] = useState(false)
        const navigate = useNavigate();
        const currentUser = useSelector(selectCurrentUser)
        const token = useSelector(selectCurrentToken)
        useEffect(() => {
            if (!token) {
                return
            }
            setIsUser(() => true)
            setLoading(false)
        }, [currentUser, navigate]);

        if (error) {
            return null
        }
        if (!isUser) {
            return null
        }
        return <WrappedComponent {...props} />;
    };

    ComponentwithAuth.displayName = `WithAuth(${displayName})`;
    return ComponentwithAuth;
}