import React, { useContext, useState } from 'react';
import {Button, Form} from 'react-bootstrap';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';
import { useNavigate } from 'react-router-dom';

export default function BadgerRegister() {

    // TODO Create the register component.
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const nav = useNavigate();

    function handleRegisterSubmit(e) {
        e?.preventDefault();

        if(username === "" || password === "") {
            alert("You must provide both a username and password!");
            return;
        } else if(password !== confirmPassword) {
            alert("Your passwords do not match!");
            return;
        }

        fetch("https://cs571.org/api/s24/hw6/register", {
            method: "POST",
            credentials: 'include',
            headers: {
                "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(res => {
            if(res.status === 200) {
                alert("Registration was successful!");
                setLoginStatus(true);
                sessionStorage.setItem("isLoggedIn", true);
                sessionStorage.setItem("loggedInUser", username);
                nav('..');
            } else if(res.status === 409) {
                alert("That username has already been taken!")
            }
        }).then(data => {
            if(data.user) {
                sessionStorage.setItem("loggedInUser", data.user.username);
                console.log("Stored username:", sessionStorage.getItem("loggedInUser"));
            }
        })
    }

    return <>
        <h1>Register</h1>
        <Form>
            <Form.Group>
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control id="username" type="username" value={username} onChange={(e) => {setUsername(e.target.value)}}/>
            </Form.Group>
            <Form.Group>
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control id="password" type="password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
            </Form.Group>
            <Form.Group className="mb-2">
                <Form.Label htmlFor="repeatedPassword">Repeat Password</Form.Label>
                <Form.Control id="repeatedPassword" type="password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleRegisterSubmit}>
                Register
            </Button>
        </Form>
    </>
}
