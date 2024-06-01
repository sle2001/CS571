import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Button, Modal, Text, TextInput, Alert } from "react-native";
import BadgerChatMessage from "../helper/BadgerChatMessage";
import CS571 from '@cs571/mobile-client';
import * as SecureStore from 'expo-secure-store';

function BadgerChatroomScreen(props) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        refresh();
    }, [props.name]);

    function refresh() {
        setIsLoading(true);
        fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`, {
            method: 'GET',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            setMessages(data.messages);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
            setIsLoading(false);
        });
    }

    function handlePost() {
        SecureStore.getItemAsync("token")
        .then(token => {
            fetch(`https://cs571.org/api/s24/hw9/messages?chatroom=${props.name}`, {
                method: "POST",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title,
                    content: body
                })
            }).then(res => {
                if(res.status === 200) {
                    setShowModal(false);
                    setTitle("");
                    setBody("");
                    Alert.alert("Successfully posted!")
                    refresh();
                } else if(res.status === 400) {
                    console.log(title);
                    console.log(body);
                    console.log("this ran");
                }
            })
        })
    }

    function handleDelete(id) {
        console.log(id);
        SecureStore.getItemAsync("token")
        .then(token => {
            console.log("Token:", token);
            fetch(`https://cs571.org/api/s24/hw9/messages?id=${id}`, {
                method: "DELETE",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }).then(res => {
                if(res.status === 200) {
                    Alert.alert("Successfully deleted the post!")
                    refresh();
                } else {
                    console.log(res.status);
                }
            })
        })
    }

    return <View style={{ flex: 1 }}>
        <FlatList
            data={messages}
            onRefresh={refresh}
            refreshing={isLoading}
            keyExtractor={message => message.id}
            renderItem={({ item }) => (
                <BadgerChatMessage
                    activeUser={props.activeUser}
                    del={handleDelete}
                    {...item}
                />
            )}
        />
        <View style={{ backgroundColor: "darkred", padding: 10 }}>
            {
                (props.activeUser === "") ? <></> : <Button title="ADD POST" color = "white" onPress={() => setShowModal(true)}/>
            }
        </View>
        <Modal visible={showModal} transparent={true}>
            <View style={styles.modal}>
                <Text style={{fontSize: 20, paddingBottom: 20}}>Create A Post</Text>
                <Text style={{fontSize: 15, paddingBottom: 10}}>Title</Text>
                <TextInput style={styles.titleInput} value={title} onChangeText={setTitle} />
                <Text style={{fontSize: 15, paddingBottom: 10, paddingTop: 20}}>Body</Text>
                <TextInput style={styles.bodyInput} value={body} onChangeText={setBody} />
                <View style={styles.buttonContainer}>
                    <Button title="Create Post" disabled={title==="" || body===""} onPress={() => handlePost()}/>
                    <Button title="Cancel" onPress={() => setShowModal(false)}/>
                </View>
            </View>
        </Modal>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        margin: 20,
        marginTop: 300,
        padding: 35,
        borderRadius: 20,
        backgroundColor: "white",
        justifyContent: "center",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    titleInput: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderColor: 'black' 
    },
    bodyInput: {
        height: 100,
        borderWidth: 1,
        borderColor: 'black', 
        paddingBottom: 70,
        paddingLeft: 10,
    },
    buttonContainer: {
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "space-around",
    }
});

export default BadgerChatroomScreen;
