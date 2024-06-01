import { useState } from "react";
import { Button, StyleSheet, TextInput, Text, View } from "react-native";

function BadgerLoginScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return <View style={styles.container}>
        <Text style={{ fontSize: 36, paddingBottom: 40 }}>BadgerChat Login</Text>
        <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Username</Text>
            <TextInput
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                style={styles.input}
            />
        </View>
        <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Password</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry={true}
                style={styles.input}
            />
        </View>
        <View style={styles.loginButtonContainer}>
            <Button 
                color="white" 
                title="LOGIN" 
                onPress={() => { props.handleLogin(username, password); }} 
            />
        </View>
        <Text style={{paddingBottom: 10, paddingTop: 10}}>New here?</Text>
        <View style={styles.signupButtonContainer}>
            <Button color="white" title="SIGNUP" onPress={() => props.setIsRegistering(true)} />
        </View>
        <View style={styles.guestButtonContainer}>
            <Button color="white" title="CONTINUE AS GUEST" onPress={() => props.setIsLoggedIn(true)} />
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        marginBottom: 20,
        width: '80%',
        paddingBottom: 10
    },
    inputText: {
        fontSize: 18,
        textAlign: 'center',
        paddingBottom: 10
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderColor: 'grey'
    },
    loginButtonContainer: {
        width: '20%',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "darkred",
        marginBottom: 20,
        elevation: 10
    },
    signupButtonContainer: {
        width: '25%',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "gray",
        marginBottom: 20,
        elevation: 10
    },
    guestButtonContainer: {
        width: '50%',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "gray",
        marginBottom: 20,
        elevation: 10
    }
});

export default BadgerLoginScreen;