import React, { useState, useEffect, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BadgerTabs from './navigation/BadgerTabs';
import CS571 from "@cs571/mobile-client";

const BadgerContext = createContext();

export default function BadgerNews() {
    const [prefs, setPrefs] = useState([]);
    const [tags, setTags] = useState([]);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetch("https://cs571.org/api/s24/hw8/articles", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            setArticles(data);

            const uniqueTags = [];
            data.forEach(article => {
                article.tags.forEach(tag => {
                    if (!uniqueTags.includes(tag)) {
                        uniqueTags.push(tag);
                    }
                })
            })
            setTags(uniqueTags);
            setPrefs(uniqueTags); 
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    }, []);

    return (
        <BadgerContext.Provider value={{ prefs, tags, articles, setPrefs }}>
            <NavigationContainer>
                <BadgerTabs />
            </NavigationContainer>
        </BadgerContext.Provider>
    );
}

export function useBadgerContext() {
    return useContext(BadgerContext);
}
