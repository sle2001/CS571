import React from "react";
import { Pressable, StyleSheet, View, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BadgerNewsItemCard(props) {
    const imageUrl = `https://raw.githubusercontent.com/CS571-S24/hw8-api-static-content/main/${props.img}`;
    const navigation = useNavigation();

    const visitArticle = () => {
        navigation.push("Article", {
            title: props.title,
            img: props.img,
            fullArticleId: props.fullArticleId
        })
    }

    return (
        <Pressable onPress={visitArticle}>
            <View style={styles.card}>
                <Image
                    style={styles.image}
                    source={{ uri: imageUrl }}
                />
                <View>
                    <Text style={{fontSize: 25}}>{props.title}</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 5,
        margin: 10,
        backgroundColor: "#ffffff", // Add background color to the card
        borderRadius: 5,
        alignItems: "center",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    image: {
        width: 390,
        height: 300,
        marginBottom: 15,
    }
});
