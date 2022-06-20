// Importing Router for routing to different pages for different links
import { BrowserRouter as Router, Switch, Route, Link, useLocation } from 'react-router-dom';

// Importing UI components from React Bootstrap
import { Row, Col, Form, Button, Container, Table } from 'react-bootstrap';

// Importing hooks (useState, useEffect) for state handling in functional components
import { useState, useEffect } from 'react';

// Importing axios for sending  GET/POST requests to the server
import axios from 'axios';

// Importing fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashAlt, faFileLines, faCircleLeft } from '@fortawesome/free-regular-svg-icons';

// Importing styles
import './TeacherQuizzes.css';

const QuizResults = ({ teacher }) => {

    const location = useLocation();
    const quiz = location.state.quiz;

    // Creating state for storing all quiz results of a quiz
    const [quizResults, setQuizResults] = useState([]);

    // Function for fetching all quiz results of the quiz
    const getQuizResults = () => {
        axios.get(`http://localhost:4000/getQuizResults/${quiz.id}`).then((response) => {
            console.log(response.data);
            setQuizResults(response.data);
        })
            .catch((err) => {
                console.log(err);
            });
    };

    // Invoking the getQuizResults() function the first time the component is rendered
    useEffect(() => {
        getQuizResults();
    }, []);

    // Creating states for showing/hiding the dialog box, and storing the ID of the quiz result to be deleted
    const [showDialog, setShowDialog] = useState(false);
    const [deleteID, setDeleteID] = useState(-1);

    // Functions for showing and hiding the dialog box
    const open = () => setShowDialog(true);
    const close = () => setShowDialog(false);

    // Function for deleting a quiz result
    const deleteQuizResult = () => {
        close();
        axios.post("http://localhost:4000/deleteQuizResult", { quiz_id: quiz.id, result_id: deleteID })
            .then((response) => {
                console.log(response);
                window.location.reload();
            })
            .catch(error => console.error(`Error: ${error}`));
    };

    return (
        <>
            {showDialog && (
                <Row className="delete-alert-box py-4 px-0 mx-0">
                    <Col xs={12} className="d-flex justify-content-center px-0 mx-0"><h5>Are you sure you want to delete this student quiz record?</h5></Col>
                    <Col xs={12} className="d-flex justify-content-center px-0 mx-0">
                        <button className="quiz-delete-btn px-4 py-2 mx-2 mt-3" onClick={deleteQuizResult}>Yes</button>
                        <button className="quiz-delete-btn px-4 py-2 mx-2 mt-3" onClick={close}>
                            No
                        </button>
                    </Col>
                </Row>
            )}
            <Container className="content-container mt-5 py-2">
                <div className='quiz-head'><Link to="/teacher/quizzes" className='back-link'><FontAwesomeIcon icon={faCircleLeft} /></Link> Results: <span className='quiz-name'>{quiz.name}</span></div>
                <div className='table-container mt-4'>
                    <Table striped hover className="">
                        <thead>
                            <tr>
                                <th className="t-head">NAME</th>
                                <th className="t-head">SUBMITTED ON</th>
                                <th className="t-head">RESULT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                quizResults.map((result) => {
                                    return (
                                        <>
                                            <tr>
                                                <td>{result.name}</td>
                                                <td>{result.submitted_on.slice(0, 10)}</td>
                                                <td>{result.obtained_marks}/{result.total_marks}</td>
                                                <td><FontAwesomeIcon icon={faTrashAlt} onClick={() => { setDeleteID(result.id); open(); }} /></td>
                                            </tr>
                                        </>
                                    );
                                })
                            }
                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    );
}

export default QuizResults;
