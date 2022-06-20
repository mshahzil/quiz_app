// Importing Link and useHistory for routing to different pages
import { Link, useHistory } from 'react-router-dom';

// Importing UI components from React Bootstrap
import { Container, Table } from 'react-bootstrap';

// Importing hooks (useState, useEffect) for state handling in functional components
import { useState, useEffect } from 'react';

// Importing axios for sending GET/POST requests to the server
import axios from 'axios';

// Importing fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';

// Importing styles
import '../Teacher/TeacherQuizzes.css';
import './StudentQuizzes.css';

const StudentQuizzes = ({ student }) => {

    const history = useHistory();
    axios.defaults.withCredentials = true;

    // Creating state for storing all quizzes available to a student
    const [quizzes, setQuizzes] = useState([]);

    // Function for fetching all quizzes available to the logged in student
    const getQuizzes = () => {
        axios.get(`http://localhost:4000/getStudentQuizzes/${student.teacher_id}/${student.id}`).then((response) => {
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

    return (
        <>
            <Container className="content-container mt-5 py-2">
                <div className="d-flex justify-content-between align-items-center">
                    <div className='quiz-head'>All Quizzes</div>
                </div>
                <div className='table-container mt-4'>
                    <Table striped hover className="">
                        <thead>
                            <tr>
                                <th className="t-head">NAME</th>
                                <th className="t-head">TEACHER</th>
                                <th className="t-head">RESULT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                quizzes.map((quiz) => {
                                    return (
                                        <>
                                            <tr>
                                                <td><Link to={{ pathname: "/student/attemptQuiz", state: { quiz_id: quiz.id } }} className="quiz-link"><FontAwesomeIcon icon={faFileLines} className="quiz-icon-2" />{quiz.quiz_name}</Link></td>
                                                <td>{quiz.teacher_name}</td>
                                                <td>{(quiz.obtained_marks) ? quiz.obtained_marks : "-"}/{quiz.total_marks}</td>
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

export default StudentQuizzes;