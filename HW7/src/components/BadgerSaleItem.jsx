import { Text, View, Image } from "react-native";
import React from 'react';

export default function BadgerSaleItem(props) {

    return <View>
        {
            props.imgSrc ? <Image style={{width: 300, height:300}} source={{uri: props.imgSrc}}/> : <></>
        }
        <Text style={{paddingLeft: 100, fontSize: 40, paddingBottom: 10}}>{props.name}</Text>
        <Text style={{paddingLeft: 85, fontSize: 25, paddingBottom: 10}}>${props.price.toFixed(2)} each</Text>
        <Text style={{paddingLeft: 30, fontSize: 20}}>You can order up to {props.upperLimit} units!</Text>
    </View>
}
