import { useContext, useState, useEffect } from "react";
import BadgerBudsDataContext from "../../../contexts/BadgerBudsDataContext";
import { Button, Col, Row } from 'react-bootstrap';

export default function BadgerBudsBasket(props) {
    const buds = useContext(BadgerBudsDataContext);
    const [savedCatIds, setSavedCatIds] = useState(JSON.parse(sessionStorage.getItem('savedCatIds') || "[]"));
    const adoptedCatIds = JSON.parse(sessionStorage.getItem('adoptedCatIds') || "[]");
    const savedBuddies = buds.filter(bud => savedCatIds.includes(bud.id));

    const unselectCat = (catId, catName) => {
        const newSavedCatsId = savedCatIds.filter(id => id !== catId);
        sessionStorage.setItem('savedCatIds', JSON.stringify(newSavedCatsId));
        
        alert(`${catName} has been removed from your basket!`);
    };

    const adoptCat = (catId, catName) => {
        const newSavedCatsId = savedCatIds.filter(id => id !== catId);
        sessionStorage.setItem('savedCatIds', JSON.stringify(newSavedCatsId));

        const newAdoptedCatIds = [...adoptedCatIds, catId];
        sessionStorage.setItem('adoptedCatIds', JSON.stringify(newAdoptedCatIds));
        
        alert(`${catName} has been adopted!`);
    };

    useEffect(() => {
        setSavedCatIds(JSON.parse(sessionStorage.getItem('savedCatIds') || "[]"));
    }, [savedCatIds]);

    return (
        <div>
            <h1>Badger Buds Basket</h1>
            <p>These cute cats could be all yours!</p>
            {savedBuddies.length === 0 ? (<p>You have no buds in your basket!</p>) : 
            (<><Row>
                {savedBuddies.map(bud => (
                    <Col key={bud.id} xs={12} md={6} lg={4} xl={3}>
                        <div key={props.id} className="display-box display-box-view">
                            <img src={`https://raw.githubusercontent.com/CS571-S24/hw5-api-static-content/main/cats/${bud.imgIds[0]}`} alt={`A picture of ${bud.name}`} />
                                    
                            <h2>{bud.name}</h2>

                            <div className="bud-actions">
                                <Button className="unselect-button" onClick={() => unselectCat(bud.id, bud.name)}>Unselect</Button>
                                <Button className="save-button" onClick={() => adoptCat(bud.id, bud.name)}>Adopt</Button>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row></>)}
        </div>
    );
}