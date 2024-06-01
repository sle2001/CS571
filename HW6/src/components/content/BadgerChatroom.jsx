import React, { useEffect, useState, useRef, useContext } from "react"
import BadgerMessage from "./BadgerMessage"
import { Button, Form, Pagination, Container, Row, Col } from "react-bootstrap"
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext"

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const titleRef = useRef();
    const contentRef = useRef();

    const loadMessages = () => {
        fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}&page=${activePage}`, {
            headers: {
                "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6"
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };

    const buildPaginator = () => {
        const numPages = 4;
        let pages = [];

        for(let i = 1; i <= numPages; ++i) {
            pages.push(
                <Pagination.Item key={i} active={activePage === i} onClick={() => setActivePage(i)}>
                    {i}
                </Pagination.Item>
            )
        }

        return pages;
    };

    const createPost = e => {
        e.preventDefault();

        if(!titleRef.current.value || !contentRef.current.value) {
            alert("You must provide both a title and content!")
        }
            
        fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: titleRef.current.value,
                content: contentRef.current.value
            })
        }).then(res => {
            if(res.status === 200) {
                alert("Succesfully posted!");
                loadMessages();
                titleRef.current.value = '';
                contentRef.current.value = '';
            } else if(res.status === 401) {
                alert("You must be logged in to post!")
            }
        })
    };

    const deletePost = id => {
        fetch(`https://cs571.org/api/s24/hw6//messages?id=${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "X-CS571-ID": "bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6",
                "Content-Type": "application/json"
            }
        }).then(res => {
            if(res.ok) {
                alert("Successfully deleted the post!");
                loadMessages();
            }
        })

    }

    useEffect(() => {
        // Reset active page to 1 when chatroom changes
        setActivePage(1);
    }, [props.name]);

    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(loadMessages, [props, activePage]);

    return <div>
        <h1>{props.name} Chatroom</h1>
        <hr/>
        <Container>
            <Row>
                <Col>
                    {loginStatus ? (
                        /* TODO: Allow an authenticated user to create a post. */
                        <Form onSubmit={createPost}>
                            <Form.Label htmlFor="titleInput">Title</Form.Label>
                            <Form.Control id="titleInput" ref={titleRef}></Form.Control>
                            <Form.Label htmlFor="contentInput">Content</Form.Label>
                            <Form.Control id="contentInput" ref={contentRef}></Form.Control>
                            <br/>
                            <Button type="submit">Create Post</Button>
                        </Form>    
                        ) : (
                            <p>You must be logged in to post</p>
                    )}
                </Col>
            </Row>
            <hr/>
            <Col>
                <Row>
                    {messages.length > 0 ? messages.map(message => (
                        /* TODO: Complete displaying of messages. */
                        <Col key={message.id} xs={12} md={6} lg={4} xl={3}>
                            <BadgerMessage {...message} deletePost={deletePost}/>
                        </Col>
                        ))
                        :
                        <Col>
                            <p>There are no messages on this page yet!</p>
                        </Col>
                    }
                </Row>
            </Col>
        </Container>
        <Container>
            <Row>
                <Col>
                    <Pagination>
                        {buildPaginator()}
                    </Pagination>
                </Col>
            </Row>
        </Container>
        
    </div>
}
