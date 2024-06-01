import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BadgerNewsStack from './BadgerNewsStack'
import BadgerPreferencesScreen from '../screens/BadgerPreferencesScreen'
import { Ionicons } from '@expo/vector-icons';

const BadgerNewsTab = createBottomTabNavigator();

function BadgerTabs() {
    return (
            <BadgerNewsTab.Navigator>
                <BadgerNewsTab.Screen 
                    name="News" 
                    component={BadgerNewsStack} 
                    options={{
                        headerShown: false,
                        tabBarIcon: () => (
                            <Ionicons name="newspaper" size={24} color="black" />
                        )
                    }}/>
                <BadgerNewsTab.Screen 
                    name="Preferences" 
                    component={BadgerPreferencesScreen} 
                    options={{
                        headerTitleStyle: {fontSize: 25, fontWeight: 'bold'},
                        tabBarIcon: () => (
                            <Ionicons name="settings" size={24} color="black" />
                        )
                    }}/>
            </BadgerNewsTab.Navigator>
    );
}

export default BadgerTabs; 