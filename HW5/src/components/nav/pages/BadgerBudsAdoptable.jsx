import { useContext, useState, useEffect } from 'react';
import BadgerBudsDataContext from '../../../contexts/BadgerBudsDataContext';
import BadgerBudSummary from '../../BadgerBudSummary';
import { Row, Col } from 'react-bootstrap';

export default function BadgerBudsAdoptable(props) {
    const buds = useContext(BadgerBudsDataContext); // Get data
    const [savedCatIds, setSavedCatIds] = useState(JSON.parse(sessionStorage.getItem('savedCatIds') || "[]")); // Get the saved cats or new list
    const adoptedCatIds = JSON.parse(sessionStorage.getItem('adoptedCatIds') || "[]"); // Get the adopted cats or new list
    const unsavedBuds = buds.filter(bud => !savedCatIds.includes(bud.id) && !adoptedCatIds.includes(bud.id)); // Get the unsaved cats

    const saveCat = (catId, catName) => {
        const newSavedCatIds = [...savedCatIds, catId];
        setSavedCatIds(newSavedCatIds);
        
        alert(`${catName} has been added to your basket!`);
    };

    useEffect(() => {
        sessionStorage.setItem('savedCatIds', JSON.stringify(savedCatIds));
    }, [savedCatIds]);

    return (
        <div>
            <h1>Available Badger Buds</h1>
            <p>The following cats are looking for a loving home! Could you help?</p>
            {unsavedBuds.length === 0 ? (<p>{"No buds are available for adoption!"}</p>) : 
            (<><Row>
                    {unsavedBuds.map(bud => (
                        <Col key={bud.id} xs={12} md={6} lg={4} xl={3}>
                            <BadgerBudSummary bud={bud} saveCat={saveCat}/>
                        </Col>
                    ))}
                </Row></>)}
        </div>
    );
}