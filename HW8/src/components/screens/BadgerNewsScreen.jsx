import React from "react";
import { ScrollView, Text } from "react-native";
import { useBadgerContext } from '../BadgerNews';

import BadgerNewsItemCard from "../BadgerNewsItemCard";

function BadgerNewsScreen() {
    const { articles, prefs } = useBadgerContext(); // Access articles and prefs from context

    // Filter articles based on user preferences
    const filteredArticles = articles.filter(article => {
        // Check if any of the article tags are included in the user preferences
        return article.tags.some(tag => prefs.includes(tag));
    });

    return (
        <ScrollView>
            {filteredArticles.length === 0 ? (
                <Text style={{textAlign: "center", fontSize: 40, paddingTop: 200}}>There are no articles that fit your preferences!</Text>
            ) : (
                filteredArticles.map(article => (
                    <BadgerNewsItemCard key={article.id} {...article} />
                ))
            )}
        </ScrollView>
    );
}

export default BadgerNewsScreen;
