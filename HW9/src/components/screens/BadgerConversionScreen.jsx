import { Alert, Button, StyleSheet, Text, View } from "react-native";
import BadgerRegisterScreen from "./BadgerRegisterScreen";

function BadgerConversionScreen(props) {

    return <View style={styles.container}>
        <Text style={{fontSize: 24, marginTop: -100}}>Ready to signup?</Text>
        <Text>Join BadgerChat to be able to make posts!</Text>
        <Text/>
        {props.isRegistering ? (
            <BadgerRegisterScreen handleSignup={props.handleSignup} setIsRegistering={props.setIsRegistering} />
        ) : (
            <Button title="Signup!" color="darkred" onPress={() => {props.setIsRegistering(true); props.setIsLoggedIn(false);}}/>
        )}

    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default BadgerConversionScreen;