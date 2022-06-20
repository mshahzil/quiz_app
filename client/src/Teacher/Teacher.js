// Importing styles for Teacher Portal
import './Teacher.css';

// Importing Link and useHistory for routing to different pages
import { Link, useHistory } from 'react-router-dom';

// Importing UI components from React Bootstrap
import { Container } from 'react-bootstrap';

// Importing hooks (useState, useEffect) for state handling in functional components
import { useState, useEffect } from 'react';

// Importing axios for sending  GET/POST requests to the server
import axios from 'axios';

// Importing components of Teacher Portal
import TeacherQuizzes from './TeacherQuizzes';
import TeacherStudents from './TeacherStudents';
import AddQuiz from './AddQuiz';
import EditQuiz from './EditQuiz';
import QuizResults from './QuizResults';


const Teacher = ({ tab }) => {

    const history = useHistory();
    axios.defaults.withCredentials = true;

    // Creating states for keeping track of the login status
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginStatus, setLoginStatus] = useState();

    // Creating state for storing data of logged in teacher
    const [teacher, setTeacher] = useState();

    // Function for checking if user is logged in and updating the login status
    const getSession = () => {
        axios.get("http://localhost:4000/login").then((response) => {
            if (response.data.loggedIn) {
                console.log(response);
                setLoginStatus(response.data.user);
                setLoggedIn(response.data.loggedIn);
            }
            else {
                history.push({
                    pathname: "/"
                });
            }
        })
    };

    // Invoking the getSession() function the first time the component is rendered
    useEffect(() => {
        getSession();
    }, []);

    // Checking the selected tab every time the component is rendered
    useEffect(() => {
        if (tab == "students") {
            document.getElementById("students-tab").style.color = "#f7d792";
            document.getElementById("quiz-tab").style.color = "white";
        }
        else {
            document.getElementById("students-tab").style.color = "white";
            document.getElementById("quiz-tab").style.color = "#f7d792";
        }
    });

    // Function for fetching the data of logged in teacher
    const getTeacher = async () => {
        const response = await axios.post("http://localhost:4000/getTeacher", { teacher_id: loginStatus.id });
        console.log(response.data);
        setTeacher(response.data[0]);
    }

    // Invoking the getTeacher() function when the loginStatus is updated
    useEffect(() => {
        getTeacher();
    }, [loginStatus]);

    // Function for signing out the user and destroying the session
    const signOut = () => {
        axios.post("http://localhost:4000/signOut").then((response) => {
            console.log(response);
            if (response.data.loggedOut) {
                history.push({
                    pathname: "/"
                });
            }
            else {
                console.log(response.data.message);
            }
        })
    }

    return (
        <>
            <div className="header">
                <Container fluid className="py-3 header-container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className='d-flex align-items-center'>
                            <i className="fas fa-book fa-2x pr-2 mr-1"></i>
                            <span className="header-title pr-3">Quiz App</span>
                            <span className="header-subtitle pl-3">Teacher Portal</span>
                            <Link to="/teacher/students" className='ml-5 tab' id="students-tab">Students</Link>
                            <Link to="/teacher/quizzes" className='ml-4 tab' id="quiz-tab">Quiz</Link>
                        </div>
                        <Link to="#" onClick={signOut} id="signout-link">Sign Out</Link>
                    </div>
                </Container>
            </div>
            {(teacher) ?
                {
                    'quiz': <TeacherQuizzes teacher={teacher} />,
                    'addQuiz': <AddQuiz teacher={teacher} />,
                    'editQuiz': <EditQuiz teacher={teacher} />,
                    'quizResults': <QuizResults teacher={teacher} />,
                    'students': <TeacherStudents teacher={teacher} />,
                }[tab]
                : null
            }
        </>
    );
}

export default Teacher;
