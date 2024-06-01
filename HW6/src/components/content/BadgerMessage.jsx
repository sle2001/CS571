import React from "react"
import { Card, Button } from "react-bootstrap";

function BadgerMessage(props) {

    const dt = new Date(props.created);
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const loggedInUser = sessionStorage.getItem("loggedInUser");

    const handleDelete = () => {
        props.deletePost(props.id);
    };

    return (
        <Card style={{margin: "0.5rem", padding: "0.5rem"}}>
            <h2>{props.title}</h2>
            <sub>Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</sub>
            <br/>
            <i>{props.poster}</i>
            <p>{props.content}</p>
            {isLoggedIn && (props.poster === loggedInUser) && (
                <Button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white'}}>
                    Delete
                </Button>
            )}
        </Card>
    );
}

export default BadgerMessage;
