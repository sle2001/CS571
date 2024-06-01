import React, {useContext, useRef} from 'react';
import {Form, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';


export default function BadgerLogin() {

    // TODO Create the login component.
    const usernameRef = useRef();
    const passwordRef = useRef();
    const nav = useNavigate();

    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    function handleLoginSubmit(e) {
        e?.preventDefault();

        if(!(usernameRef.current.value) || !(passwordRef.current.value)) {
            alert("You must provide both a username and password!");
            return;
        }

        fetch("https://cs571.org/api/s24/hw6/login", {
            method: "POST",
            credentials: "include", 
            headers: {
                "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameRef.current.value,
                password: passwordRef.current.value
            })
        }).then(res => {
            if(res.status === 200) {
                alert("Login was successful");
                setLoginStatus(true);
                sessionStorage.setItem("isLoggedIn", true);
                sessionStorage.setItem("loggedInUser", usernameRef.current.value);
                nav('..');
            } else if(res.status === 401) {
                alert("Incorrect username or password!");
            }
        })


    }

    return <>
        <h1>Login</h1>
        <Form onSubmit={handleLoginSubmit}>
            <Form.Label htmlFor="usernameInput">Username</Form.Label>
            <Form.Control id="usernameInput" ref={usernameRef}></Form.Control>
            <Form.Label htmlFor="passwordInput">Password</Form.Label>
            <Form.Control id="passwordInput" type="password" ref={passwordRef}></Form.Control>
            <br/>
            <Button type="submit" onClick={handleLoginSubmit}>Login</Button>
        </Form>
    </>
}
