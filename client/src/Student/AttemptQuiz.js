// Importing useHistory and useLocation for routing and sending data to different pages
import { useHistory, useLocation } from 'react-router-dom';

// Importing UI components from React Bootstrap
import { Row, Col, Container } from 'react-bootstrap';

// Importing hooks (useState, useEffect) for state handling in functional components
import { useState, useEffect } from 'react';

// Importing axios for sending  GET/POST requests to the server
import axios from 'axios';

// Importing UI components from React Bootstrap
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleRight } from '@fortawesome/free-regular-svg-icons';

// Importing styles
import '../Teacher/TeacherQuizzes.css';

const AttemptQuiz = ({ student }) => {

    const history = useHistory();
    const location = useLocation();

    const quiz_id = location.state.quiz_id;

    // Creating states for storing the quiz details, quiz questions, and number of questions
    const [quiz, setQuiz] = useState({});
    const [questions, setQuestions] = useState([]);
    const [numQuestions, setNumQuestions] = useState(0);

    // Creating states for storing the student answers and the correct answers
    const [answers, setAnswers] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    
    // Function for fetching details of the quiz
    const getQuiz = () => {
        axios.get(`http://localhost:4000/getQuiz/${quiz_id}`).then((response) => {
            console.log(response.data);
            setQuiz(response.data[0]);
        })
            .catch((err) => {
                console.log(err);
            });
    };

    // Function for fetching all questions of the quiz
    const getQuestions = () => {
        axios.get(`http://localhost:4000/getQuestions/${quiz_id}`).then((response) => {
            console.log(response.data);
            setQuestions(response.data);
            setNumQuestions(response.data.length);

            let correct = [];
            let temp = [];

            for (let i = 0; i < response.data.length; i++) {
                correct[i] = response.data[i].correct_option;
                temp[i] = "";
            }

            setCorrectAnswers([...correct]);
            setAnswers([...temp]);
        })
            .catch((err) => {
                console.log(err);
            });
    };

    // Invoking the getQuiz() and getQuestions() functions the first time the component is rendered
    useEffect(() => {
        getQuiz();
        getQuestions();
    }, []);

    // Function for updating student answers
    const updateAnswers = (e, i) => {
        let x = [...answers];
        x[i] = e.target.value;
        setAnswers([...x]);
    };

    // Function for submitting the quiz and calculating the student score
    const submitQuiz = () => {
        let obtained = 0;
        for (let i = 0; i < correctAnswers.length; i++) {
            if (answers[i] == correctAnswers[i]) {
                obtained++;
            }
        }

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;

        axios.post("http://localhost:4000/saveQuizResult", { quiz_id: quiz.id, student_id: student.id, submitted_on: today, obtained_marks: obtained, total_marks: numQuestions })
            .then((response) => {
                console.log(response);
                document.getElementById("update-alert").style.visibility = "visible";
                setTimeout(() => {
                    history.push({
                        pathname: "/student/result",
                        state: {
                            quiz: quiz,
                            obtained_marks: obtained,
                            total_marks: numQuestions
                        }
                    });
                }, 2000);
            })
            .catch(error => console.error(`Error: ${error}`));

    };

    return (
        <>
            <Container className="content-container mt-5 py-2">
                <div className="d-flex justify-content-between align-items-center">
                    <div className='quiz-head'>{quiz.name}</div>
                    <div><span id="update-alert" className='mr-3'>Quiz Submitted Successfully!</span><button onClick={submitQuiz} className='new-quiz-btn'><FontAwesomeIcon icon={faCircleRight} /> SUBMIT</button></div>
                </div>
                {questions.map((question, index) => {
                    return (
                        <div className='attempt-quiz-question-container mt-4'>
                            <Row>
                                <Col xs={12} className="pb-4">
                                    <h6>{question.question}</h6>
                                </Col>
                                <br />
                                <Col xs={6} className="mb-4">
                                    <input type="radio" value="A" name={index} onChange={(e) => { updateAnswers(e, index); }} />
                                    <label className='ml-2'>{question.option_a}</label>
                                </Col>
                                <Col xs={6}>
                                    <input type="radio" value="B" name={index} onChange={(e) => { updateAnswers(e, index); }} />
                                    <label className='ml-2'>{question.option_b}</label>
                                </Col>
                                <Col xs={6}>
                                    <input type="radio" value="C" name={index} onChange={(e) => { updateAnswers(e, index); }} />
                                    <label className='ml-2'>{question.option_c}</label>
                                </Col>
                                <Col xs={6}>
                                    <input type="radio" value="D" name={index} onChange={(e) => { updateAnswers(e, index); }} />
                                    <label className='ml-2'>{question.option_d}</label>
                                </Col>
                            </Row>
                        </div>
                    );
                })}
            </Container>
        </>
    );
}

export default AttemptQuiz;