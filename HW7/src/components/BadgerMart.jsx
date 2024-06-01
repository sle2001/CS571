import { Alert, Text, View, Button } from "react-native";
import BadgerSaleItem from "./BadgerSaleItem";
import { useEffect, useState } from "react";

import CS571 from '@cs571/mobile-client'

export default function BadgerMart(props) {
    const [items, setItem] = useState({
        name: "Food Name",
        price: 0,
        upperLimit: 0,
        imgSrc: undefined
    });
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [basket, setBasket] = useState({});
 
    useEffect(() => {
        fetch("https://cs571.org/api/s24/hw7/items", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setItem(data);

            const defaultBasket = {};
            data.forEach(item => {
                defaultBasket[item.name] = 0;
            });
            setBasket(defaultBasket)
        })
    }, [])

    const prevItem = () => {
        if(currentItemIndex !== 0) {
            setCurrentItemIndex(currentItemIndex - 1);
        }
    }

    const nextItem = () =>{
        if(currentItemIndex !== (items.length - 1)) {
            setCurrentItemIndex(currentItemIndex + 1);
        }
    }

    const addToBasket = () => {
        const itemName = items[currentItemIndex].name;
        if(basket[itemName] < items[currentItemIndex].upperLimit) {
            setBasket(prevBasket => ({...prevBasket, [itemName]: prevBasket[itemName] + 1}));
        }
    }

    const removeFromBasket = () => {
        const itemName = items[currentItemIndex].name;
        if(basket[itemName] > 0) {
            setBasket(prevBasket => ({...prevBasket, [itemName]: prevBasket[itemName] - 1}));
        }
    }

    let totalItems = 0;
    let totalPrice = 0;
    for(let itemName in basket) {
        totalItems += basket[itemName];
        totalPrice += basket[itemName]*items.find(item => item.name === itemName).price;
    }
    
    const submitOrder = () => {
        Alert.alert("Order Confirmed!", `Your order contains ${totalItems} items and would have cost $${totalPrice.toFixed(2)}!`, 
        [
            {text: 'OK', 
            onPress: () => {
                const defaultBasket = {};
                for(let itemName in basket) {
                    defaultBasket[itemName] = 0;
                }
                setBasket(defaultBasket); // Reset basket to default values

                setCurrentItemIndex(0);
            }}
        ]
        );
    }

    return <View style={{flex: 1, paddingTop: 50, alignItems: 'center'}}>
        <Text style={{fontSize: 28}}>Welcome to Badger Mart!</Text>
        <View style={{flexDirection: 'row', paddingTop: 50, paddingRight: 20}}>
            <Button title="PREVIOUS" onPress={prevItem} disabled={currentItemIndex === 0}/>
            <View style={{width: 40}}></View>
            <Button title="NEXT" onPress={nextItem} disabled={currentItemIndex === items.length-1}/>
        </View>
        {items.length > 0 && (
            <BadgerSaleItem
                name={items[currentItemIndex].name}
                imgSrc={items[currentItemIndex].imgSrc}
                price={items[currentItemIndex].price}
                upperLimit={items[currentItemIndex].upperLimit}
            />
        )}
        <View style={{ flexDirection: 'row', paddingTop: 50, paddingRight: 20 }}>
            <Button title="-" onPress={removeFromBasket} disabled={basket[items[currentItemIndex]?.name] === 0} />
            <View style={{ width: 40 }}>
                <Text style = {{paddingLeft: 15, fontSize: 20, paddingTop: 5}}>{basket[items[currentItemIndex]?.name]}</Text>
            </View>
            <Button title="+" onPress={addToBasket} disabled={basket[items[currentItemIndex]?.name] === items[currentItemIndex]?.upperLimit} />
        </View>
        <View style={{paddingTop: 50}}>
            <Text style={{paddingBottom:10}}>You have {totalItems} item(s) costing ${totalPrice.toFixed(2)} in your cart!</Text>
            <Button title="Place Order" onPress={submitOrder} disabled={totalItems === 0}/>
        </View>
    </View>
}