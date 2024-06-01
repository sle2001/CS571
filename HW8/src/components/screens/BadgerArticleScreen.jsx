import React, { useRef, useEffect, useState, useCallback } from "react";
import { Animated, ScrollView, Image, Text, Linking, Alert } from "react-native";

import CS571 from "@cs571/mobile-client";

const OpenURLText = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Text style={{ color: 'blue', marginBottom: 20, paddingLeft: 7 }} onPress={handlePress}>{children}</Text>;
};

function BadgerArticleScreen(props) {
    const [article, setArticle] = useState({ body: null });
    const fadeRef = useRef(new Animated.Value(0));
    const [isLoading, setIsLoading] = useState(true);
    const title = props.route.params.title;
    const img = props.route.params.img;

    useEffect(() => {
        fetch(`https://cs571.org/api/s24/hw8/article?id=${props.route.params.fullArticleId}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
            .then(res => res.json())
            .then(data => {
                setArticle(data);
                setIsLoading(false);
                Animated.timing(fadeRef.current, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                }).start();
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <ScrollView>
            <Image
                source={{ uri: `https://raw.githubusercontent.com/CS571-S24/hw8-api-static-content/main/${img}` }}
                style={{ width: 428, height: 300, marginBottom: 10, paddingRight: 7, alignItems: "center" }}
            />
            <Text style={{ fontSize: 25, marginBottom: 20, fontWeight: 'bold', paddingLeft: 7 }}>{title}</Text>
            {isLoading ? (
                <Text style={{ fontSize: 20 }}>The content is loading!</Text>
            ) : (
                    <>
                        <Animated.View style={{ opacity: fadeRef.current }}>
                            <Text style={{ fontSize: 17, paddingLeft: 7, marginBottom: 5 }}>By {article.author} on {article.posted}</Text>
                            <OpenURLText url={article.url}>Read Full Article Here</OpenURLText>
                            {article.body.map((paragraph, index) => (
                                <Text key={index} style={{ paddingLeft: 7, fontSize: 17 }}>{paragraph}</Text>
                            ))}
                        </Animated.View>
                    </>
                )}
        </ScrollView>

    );
}

export default BadgerArticleScreen;
