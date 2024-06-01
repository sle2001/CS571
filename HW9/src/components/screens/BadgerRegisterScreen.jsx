import { Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react"

function BadgerRegisterScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return <View style={styles.container}>
        <Text style={{ fontSize: 36, paddingBottom: 40 }}>Join BadgerChat!</Text>
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
        <View style={styles.inputContainer}>
            <Text style={styles.inputText}>Confirm Password</Text>
            <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                secureTextEntry={true}
                style={styles.input}
            />
        </View>
        {password ? null : <Text style={styles.errMsg}>Please enter a password</Text>}
        {password === confirmPassword ? null : <Text style={styles.errMsg}>Passwords do not match</Text>}
        <View style={styles.signupButtonContainer}>
            <Button 
                color="white" 
                title="SIGNUP" 
                onPress={() => { props.handleSignup(username, password, confirmPassword); }} 
            />
        </View>
        <View style={styles.nevermindButtonContainer}>
            <Button color="white" title="NEVERMIND!" onPress={() => props.setIsRegistering(false)} />
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
        borderColor: 'grey', // Add border color here
    },
    signupButtonContainer: {
        width: '25%',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "darkred",
        marginBottom: 20,
        elevation: 10
    },
    nevermindButtonContainer: {
        width: '33%',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "gray",
        marginBottom: 20,
        elevation: 10
    },
    errMsg: {
        color: "red",
        paddingBottom: 20,
        fontSize: 15
    }
});

export default BadgerRegisterScreen;