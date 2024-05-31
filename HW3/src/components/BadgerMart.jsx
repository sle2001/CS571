import { useEffect, useState } from "react"
import BadgerSaleItem from "./BadgerSaleItem";
import { Col, Container, Row } from "react-bootstrap";

export default function BadgerMart(props) {

    const [saleItems, setSaleItems] = useState([]);
    const [featuredItem, setFeaturedItem] = useState(null); // Set featuredItem null so can be used for featured item later
    const [isLoading, setIsLoading] = useState(true); // Set isLoading to true since it's going to load until data is fetched

    useEffect(() => {
        fetch("https://cs571.org/api/s24/hw3/all-sale-items", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setSaleItems(data);
            setFeaturedItem(data.find(item => item.featured)); // Find and set the featured item
            setIsLoading(false); // Not loading anymore since featured item was found
        })
    }, [])

    return <div style = {{fontFamily: 'Helvetica, sans-serif'}}>
        <h1>Badger Mart</h1>
        <p style = {{color: '#666'}}>Welcome to our small-town mini mart located in Madison, WI!</p>    
        {isLoading ? (<p>Loading...</p>) : 
        (<p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>Today's featured item is {featuredItem.name} for ${featuredItem.price}!</p>)}
        <Container>
            <Row>
            {
                saleItems.map(saleItem => {
                    return <Col key={saleItem.name} xs={12} md={6} lg={4} xl={3}>
                        <BadgerSaleItem
                            name={saleItem.name}
                            description={saleItem.description}
                            price={saleItem.price}
                            featured={saleItem.featured}
                        />
                    </Col>
                })
            }
            </Row>
        </Container>
    </div>
}