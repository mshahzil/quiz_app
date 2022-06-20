// Importing useHistory for routing to different pages
import { useHistory } from 'react-router-dom';

// Importing UI components from React Bootstrap
import { Row, Col, Form, Container } from 'react-bootstrap';

// Importing hooks (useState) for state handling in functional components
import { useState } from 'react';

// Importing axios for sending  GET/POST requests to the server
import axios from 'axios';

// Importing fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

// Importing styles
import './TeacherQuizzes.css';

const AddQuiz = ({ teacher }) => {

    const history = useHistory();

    // Creating states for storing the quiz name, quiz questions, and number of questions
    const [quizName, setQuizName] = useState("");
    const [questions, setQuestions] = useState([{
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correct: ""
    }]);
    const [numQuestions, setNumQuestions] = useState(1);

    // Function for adding a new question
    const addQuestion = () => {
        let x = [...questions];
        x.push({});
        setQuestions([...x]);
        setNumQuestions(numQuestions + 1);
    };

    // Function for deleting a question
    const deleteQuestion = (i) => {
        let x = [...questions];
        x.splice(i, 1);
        setQuestions([...x]);
        setNumQuestions(numQuestions - 1);
    };

    // Function for setting the value of question
    const setQuestion = (question, i) => {
        let x = [...questions];
        x[i].question = question;
        setQuestions([...x]);
    };

    // Function for setting the value of Option A
    const setOptionA = (option, i) => {
        let x = [...questions];
        x[i].optionA = option;
        setQuestions([...x]);
    };

    // Function for setting the value of Option B
    const setOptionB = (option, i) => {
        let x = [...questions];
        x[i].optionB = option;
        setQuestions([...x]);
    };

    // Function for setting the value of Option C
    const setOptionC = (option, i) => {
        let x = [...questions];
        x[i].optionC = option;
        setQuestions([...x]);
    };

    // Function for setting the value of Option D
    const setOptionD = (option, i) => {
        let x = [...questions];
        x[i].optionD = option;
        setQuestions([...x]);
    };

    // Function for setting the value of Correct Option
    const setCorrectOption = (option, i) => {
        let x = [...questions];
        x[i].correct = option;
        setQuestions([...x]);
    };

    // Function for saving the new quiz
    const saveQuiz = () => {
        axios.post("http://localhost:4000/addQuiz", { teacher_id: teacher.id, quiz_name: quizName, questions: questions, num_questions: numQuestions })
            .then((response) => {
                console.log(response);
                document.getElementById("update-alert").style.visibility = "visible";
                setTimeout(() => {
                    history.push({
                        pathname: "/teacher/quizzes"
                    });
                }, 2000);
            })
            .catch(error => console.error(`Error: ${error}`));
        console.log("Save Quiz Working");
    };

    return (
        <>
            <Container className="content-container mt-5 py-2">
                <div className="d-flex justify-content-between align-items-center">
                    <div className='quiz-head'>Create New Quiz</div>
                    <div><span id="update-alert" className='mr-3'>Quiz Added Successfully!</span><button onClick={saveQuiz} className='new-quiz-btn'><FontAwesomeIcon icon={faSave} /> SAVE</button></div>
                </div>
                <div className='quiz-name-container mt-4'>
                    <Form.Group>
                        <Form.Label className='login-label'>QUIZ NAME</Form.Label>
                        <Form.Control required type="text" name="name" placeholder="" value={quizName} onChange={(e) => setQuizName(e.target.value)} />
                    </Form.Group>
                </div>
                {questions.map((question, index) => {
                    return (
                        <div className='quiz-question-container mt-4'>
                            <Row>
                                <Col xs={12} className="d-flex justify-content-end">
                                    <FontAwesomeIcon icon={faTrashAlt} size="md" onClick={() => { deleteQuestion(index); }} style={{ color: 'grey' }} />
                                </Col>
                                <Col xs={12} className="mb-4">
                                    <Form.Group>
                                        <Form.Label className='login-label'>QUESTION</Form.Label>
                                        <Form.Control required type="text" name="name" placeholder="" value={question.question} onChange={(e) => setQuestion(e.target.value, index)} />
                                    </Form.Group>
                                </Col>
                                <br />
                                <Col xs={6} className="mb-4">
                                    <Form.Group>
                                        <Form.Label className='login-label'>OPTION A</Form.Label>
                                        <Form.Control required type="text" name="name" placeholder="" value={question.optionA} onChange={(e) => setOptionA(e.target.value, index)} />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label className='login-label'>OPTION B</Form.Label>
                                        <Form.Control required type="text" name="name" placeholder="" value={question.optionB} onChange={(e) => setOptionB(e.target.value, index)} />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label className='login-label'>OPTION C</Form.Label>
                                        <Form.Control required type="text" name="name" placeholder="" value={question.optionC} onChange={(e) => setOptionC(e.target.value, index)} />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label className='login-label'>OPTION D</Form.Label>
                                        <Form.Control required type="text" name="name" placeholder="" value={question.optionD} onChange={(e) => setOptionD(e.target.value, index)} />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Select required className="mt-4 p-1 correct-option" onChange={(e) => setCorrectOption(e.target.value, index)}>
                                        <option value="" selected>Correct Option</option>
                                        <option value="A">Option A</option>
                                        <option value="B">Option B</option>
                                        <option value="C">Option C</option>
                                        <option value="D">Option D</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </div>
                    );
                })}
                <div className='add-question-container d-flex justify-content-center my-3'>
                    <button className="add-question" onClick={addQuestion}><FontAwesomeIcon icon={faCirclePlus} size="lg" className="mr-2" />ADD QUESTION</button>
                </div>
            </Container>
        </>
    );
}

export default AddQuiz;