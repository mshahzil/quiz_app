// Importing Link, useHistory and useLocation for routing and sending data to different pages
import { Link, useHistory, useLocation } from 'react-router-dom';

// Importing UI components from React Bootstrap
import { Row, Col, Container } from 'react-bootstrap';

// Importing fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons';

// Importing styles
import '../Teacher/TeacherQuizzes.css';


const StudentResult = ({ student }) => {

    const history = useHistory();
    const location = useLocation();

    // Receiving and storing data for quiz, obtained marks and total marks
    const quiz = location.state.quiz;
    const obtained_marks = location.state.obtained_marks;
    const total_marks = location.state.total_marks;

    return (
        <>
            <Container className="content-container mt-5 py-2">
                <div className="d-flex justify-content-start align-items-center">
                    <div className='quiz-head'>Results: {quiz.name}</div>
                </div>
                <div className='quiz-question-container mt-4'>
                    <Row>
                        <Col xs={12} className="mt-4 pb-2 d-flex justify-content-center">
                            <h6 className='score-head'>You have scored</h6>
                        </Col>
                        <Col xs={12} className="mb-4 d-flex justify-content-center">
                            <h1 className='score'>{obtained_marks}/{total_marks}</h1>
                        </Col>
                    </Row>
                </div>
                <div className='d-flex justify-content-center mt-3'>
                    <Link to="/student/quizzes" className="go-back">
                        <FontAwesomeIcon icon={faCircleLeft} size="lg" className="mr-2" />
                        Go back to all quizzes
                    </Link>
                </div>
            </Container>
        </>
    );
}

export default StudentResult;