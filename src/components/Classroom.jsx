import { Button, Container, Form, Row, Col, Pagination } from "react-bootstrap";
import React, {useState, useEffect} from "react";
import Student from "./Student";

const Classroom = () => {
    // Student data and students shown
    const[studData, setStudData] = useState([]); // Student Data
    const[shownStuds, setShownStuds] = useState([]); // Students shown

    // Search functionality states
    const[searchName, setSearchName] = useState(""); // Search by name
    const[searchMajor, setSearchMajor] = useState(""); // Search by major
    const[searchInterest, setSearchInterest] = useState(""); // Search by interest

    // Pagination
    const[activePage, setActivePage] = useState(1);

    // Fetch student data
    useEffect(() => {
        fetch("https://cs571.org/api/s24/hw4/students", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data); // Console log student data
            setStudData(data); // Set studData to data
            setShownStuds(data); // Set studFilter to data
        })
    }, [])

    const buildPaginator = () => {
        const numPages = Math.ceil(shownStuds.length/24);
        let pages = [];

        pages.push(
            <Pagination.Item
                key="previous"
                disabled={activePage === 1 || shownStuds.length === 0}
                onclick={() => setActivePage(prevPage => Math.max(1, prevPage - 1))}
            >
                Previous
            </Pagination.Item>
        );

        for(let i = 1; i <= numPages; ++i) {
            pages.push(
                <Pagination.Item key={i} active={activePage === i} onClick={() => setActivePage(i)}>
                    {i}
                </Pagination.Item>
            );
        }

        pages.push(
            <Pagination.Item
                key="next"
                disabled={activePage === numPages || shownStuds.length === 0}
                onClick={() => setActivePage(prevPage => Math.min(24, prevPage + 1))}
            >
                Next    
            </Pagination.Item>
        );

        return pages;
    }

    // Search Functionality 
    useEffect(() => {
        // Make all searches lowercase
        const searchNameLowercase = searchName.trim().toLowerCase(); // Search name lowercase
        const searchMajorLowercase = searchMajor.trim().toLowerCase(); // Search major lowercase
        const searchInterestLowercase = searchInterest.trim().toLowerCase(); // Search interest lowercase

        // Filter students
        const filterStuds = studData.filter((stud) => {
            const fullName = `${stud.name.first} ${stud.name.last}`.toLowerCase(); // Get full name
            

            // Check if name matches
            if(searchNameLowercase && !fullName.includes(searchNameLowercase)) {
                return false;
            }

            // Check if major matches
            if(searchMajor && !stud.major.toLowerCase().includes(searchMajorLowercase)) {
                return false;
            }
            
            // Check if any of the interest(s) matches
            if(searchInterestLowercase && !stud.interests.some((interest) => interest.toLowerCase().includes(searchInterestLowercase))) {
                return false;
            }

            return true;
        });

        setActivePage(1);
        setShownStuds(filterStuds); // Get the filtered students
    }, [searchName, searchMajor, searchInterest, studData])

    return <div>
        <h1>Badger Book</h1>
        <p>Search for students below!</p>
        <hr />
        <Form>
            <Form.Label htmlFor="searchName">Name</Form.Label>
            <Form.Control 
                id="searchName" 
                value={searchName} 
                onChange={(e) => setSearchName(e.target.value)}
            />
            <Form.Label htmlFor="searchMajor">Major</Form.Label>
            <Form.Control 
                id="searchMajor"
                value={searchMajor}
                onChange={(e) => setSearchMajor(e.target.value)}
            />
            <Form.Label htmlFor="searchInterest">Interest</Form.Label>
            <Form.Control 
                id="searchInterest"
                value={searchInterest}
                onChange={(e) => setSearchInterest(e.target.value)}
            />
            <br />
            <Button variant="neutral" onClick={() => {
                setSearchName(""); 
                setSearchMajor("");
                setSearchInterest("");
                setShownStuds(studData);
                }
            }>Reset Search</Button>
        </Form>
        <Container fluid>
            <Row>
                <p>There are {shownStuds.length} student(s) matching your search.</p>
                {
                    shownStuds.slice(24 * (activePage - 1), activePage * 24).map(stud => <Col key={stud.id} xs={12} md={6} lg={4} xl={3}>
                        <Student {...stud}/>
                    </Col>)
                }
            </Row>
        </Container>
        <Pagination>
            {buildPaginator()}
        </Pagination>
    </div>

}

export default Classroom;