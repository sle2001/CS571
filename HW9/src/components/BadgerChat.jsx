import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from "react-native"

import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';


const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [activeUser, setActiveUser] = useState('');

  useEffect(() => {
    fetch("https://cs571.org/api/s24/hw9/chatrooms", {
      method: 'GET',
      headers: {
        'X-CS571-ID': 'bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6',
        'Content-Type': 'application/json' 
      }
    }).then(res => res.json())
    .then(data => setChatrooms(data))
  }, []);

  function handleLogin(username, password) {
    fetch("https://cs571.org/api/s24/hw9/login", {
        method: 'POST',
        credentials: 'include',
        headers: {
            'X-CS571-ID': 'bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            username: username, 
            password: password 
        })
    }).then(res => {
        if (res.status === 401) {
            Alert.alert("Incorrect login, please try again.");
        } else if (res.status === 400) {
            Alert.alert("Provide username and password");
        } else {
            return res.json().then(data => {
                if (data.token) {
                    setIsLoggedIn(true);
                    setActiveUser(username);
                    SecureStore.setItemAsync('token', data.token);
                } else {
                    throw new Error("Token not found in server response");
                }
            }).catch(error => {
                Alert.alert("Error: " + error.message);
            });
        }
    }).catch(error => {
        Alert.alert("Error: " + error.message);
    });
  }

function handleSignup(username, password, confirmPassword) {
  if(password !== "" && confirmPassword === password) {
    fetch("https://cs571.org/api/s24/hw9/register", {
      method: 'POST',
      credentials: 'include',
      headers: {
          'X-CS571-ID': 'bid_c1ebd02ea0f513574b747b18f8f75789406edb7874c5f11cd1acb87ef74459e6',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
          username: username, 
          password: password 
      })
    }).then(res => {
      if (res.status === 413) {
          Alert.alert("Username must be less than or 64 characters and Password must be less than or 128 characters");
      } else if (res.status === 409) {
          Alert.alert("User already exists");
      } else if (res.status === 400) {
          Alert.alert("Please provide username and password");
      } else {
          return res.json().then(data => {
              if (data.token) {
                setIsLoggedIn(true);
                setActiveUser(username);
                SecureStore.setItemAsync('token', data.token);
              } else {
                throw new Error("Token not found in server response");
              }
          }).catch(error => {
            Alert.alert("Error: " + error.message);
          });
      }
    }).catch(error => {
        Alert.alert("Error: " + error.message);
    });
  }
}

function handleLogout() {
  SecureStore.deleteItemAsync('token').then(() => {
    setActiveUser('');
    setIsLoggedIn(false);
    setIsRegistering(false);
  })
}

  if (isLoggedIn) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} activeUser={activeUser} />}
              </ChatDrawer.Screen>
            })
          }
          {
            (activeUser === "") ?
            <ChatDrawer.Screen name="Signup">
              {() => <BadgerConversionScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} isRegistering={isRegistering} setIsLoggedIn={setIsLoggedIn} />}
            </ChatDrawer.Screen> :
            <ChatDrawer.Screen name="Log out">
                {() => <BadgerLogoutScreen handleLogout={handleLogout} />}
            </ChatDrawer.Screen>
          }
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} setIsLoggedIn={setIsLoggedIn} />
  }
}