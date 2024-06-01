
import React, { useEffect, useContext } from 'react';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';
import { useNavigate } from 'react-router-dom';

export default function BadgerLogout() {
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const nav = useNavigate();

    useEffect(() => {
        fetch('https://cs571.org/api/s24/hw6/logout', {
            method: 'POST',
            headers: {
                "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6"
            },
            credentials: "include"
        }).then(res => res.json()).then(json => {
            // Maybe you need to do something here?
            setLoginStatus(false);
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("loggedInUser");
            alert("You have been successfully logged out.");
            nav("/");
        })
    }, [setLoginStatus, nav]);

    return <>
        <h1>Logout</h1>
        <p>You have been successfully logged out.</p>
    </>
}
