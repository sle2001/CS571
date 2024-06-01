import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BadgerNewsScreen from "../screens/BadgerNewsScreen";
import BadgerArticleScreen from "../screens/BadgerArticleScreen";

const BadgerStack = createNativeStackNavigator();

function BadgerNewsStack() {
    return (
        <BadgerStack.Navigator>
            <BadgerStack.Screen 
                name="Articles" 
                component={BadgerNewsScreen} 
                options={{headerTitleStyle: {fontSize: 25, fontWeight: 'bold'}}}
            />
            <BadgerStack.Screen
                name="Article"
                component={BadgerArticleScreen}
                options={{headerTitleStyle: {fontSize: 25, fontWeight: 'bold'}}}
            />
        </BadgerStack.Navigator>
    )
}

export default BadgerNewsStack;