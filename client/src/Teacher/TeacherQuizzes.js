// Importing styles for TeacherQuizzes component
import './TeacherQuizzes.css';

// Importing Link and useHistory for routing to different pages for different links
import { Link, useHistory } from 'react-router-dom';

// Importing UI components from React Bootstrap
import { Row, Col, Container, Table } from 'react-bootstrap';

// Importing hooks (useState, useEffect) for state handling in functional components
import { useState, useEffect } from 'react';

// Importing axios for sending  GET/POST requests to the server
import axios from 'axios';

// Importing fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashAlt, faFileLines } from '@fortawesome/free-regular-svg-icons';


const TeacherQuizzes = ({ teacher }) => {

    const history = useHistory();
    axios.defaults.withCredentials = true;

    // Creating state for storing all quizzes of a teacher
    const [quizzes, setQuizzes] = useState([]);

    // Function for fetching all quizzes of the logged in teacher
    const getQuizzes = () => {
        axios.get(`http://localhost:4000/getQuizzes/${teacher.id}`).then((response) => {
            console.log(response.data);
            setQuizzes(response.data);
        })
            .catch((err) => {
                console.log(err);
            });
    };

    // Invoking the getQuizzes() function the first time the component is rendered
    useEffect(() => {
        getQuizzes();
    }, []);

    // Creating states for showing/hiding the dialog box, and storing the ID of the quiz to be deleted
    const [showDialog, setShowDialog] = useState(false);
    const [deleteID, setDeleteID] = useState(-1);

    // Functions for showing and hiding the dialog box
    const open = () => setShowDialog(true);
    const close = () => setShowDialog(false);

    // Function for deleting a quiz
    const deleteQuiz = () => {
        close();
        axios.post("http://localhost:4000/deleteQuiz", { quiz_id: deleteID })
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
                    <Col xs={12} className="d-flex justify-content-center px-0 mx-0"><h5>Are you sure you want to delete this quiz?</h5></Col>
                    <Col xs={12} className="d-flex justify-content-center px-0 mx-0">
                        <button className="quiz-delete-btn px-4 py-2 mx-2 mt-3" onClick={deleteQuiz}>Yes</button>
                        <button className="quiz-delete-btn px-4 py-2 mx-2 mt-3" onClick={close}>
                            No
                        </button>
                    </Col>
                </Row>
            )}
            <Container className="content-container mt-5 py-2">
                <div className="d-flex justify-content-between align-items-center">
                    <div className='quiz-head'>All Quizzes</div>
                    <div><Link to="/teacher/addQuiz"><button className='new-quiz-btn'>NEW QUIZ +</button></Link></div>
                </div>
                <div className='table-container mt-4'>
                    <Table striped hover className="">
                        <thead>
                            <tr>
                                <th className="t-head">NAME</th>
                                <th className="t-head">SUBMITTED BY</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                quizzes.map((quiz) => {
                                    return (
                                        <>
                                            <tr>
                                                <td>{quiz.name}</td>
                                                <td>{quiz.number_of_submissions}</td>
                                                <td><Link to={{ pathname: "/teacher/quizResults", state: { quiz: quiz } }}><FontAwesomeIcon icon={faFileLines} className="quiz-icon" /></Link></td>
                                                <td><Link to={{ pathname: "/teacher/editQuiz", state: { quiz: quiz } }}><FontAwesomeIcon icon={faPenToSquare} className="quiz-icon" /></Link></td>
                                                <td><FontAwesomeIcon icon={faTrashAlt} onClick={() => { setDeleteID(quiz.id); open(); }} /></td>
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

export default TeacherQuizzes;