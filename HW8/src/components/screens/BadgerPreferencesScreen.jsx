import React from "react";
import { ScrollView, StyleSheet, Text, View, Switch } from "react-native";
import { useBadgerContext } from '../BadgerNews';

function BadgerPreferencesScreen() {
    const { prefs, tags, setPrefs } = useBadgerContext();

    const toggleSwitch = (tag) => {
        const updatedPrefs = prefs.includes(tag) ? prefs.filter(p => p !== tag) : [...prefs, tag]; 
        setPrefs(updatedPrefs); 
    };

    console.log(prefs);

    return (
        <ScrollView>
            {tags.map(tag => (
                <View key={tag} style={styles.card}>
                    <Text style={styles.title}>{tag}</Text>
                    <Switch
                        thumbColor={prefs.includes(tag) ? "green" : "red"}
                        onValueChange={() => toggleSwitch(tag)}
                        value={prefs.includes(tag)}
                    />
                </View>
            ))}
        </ScrollView>
    );
}

export default BadgerPreferencesScreen;

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: "#ffffff", // Add background color to the card
        borderRadius: 10,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    }
});
