// Importing Link and useHistory for routing to different pages
import { Link, useHistory } from 'react-router-dom';

// Importing UI components from React Bootstrap
import { Container } from 'react-bootstrap';

// Importing hooks (useState, useEffect) for state handling in functional components
import { useState, useEffect } from 'react';

// Importing axios for sending  GET/POST requests to the server
import axios from 'axios';

// Importing styles
import '../Teacher/Teacher.css';

// Importing components of Student Portal
import StudentQuizzes from './StudentQuizzes';
import AttemptQuiz from './AttemptQuiz';
import StudentResult from './StudentResult';

const Student = ({ tab }) => {

    const history = useHistory();
    axios.defaults.withCredentials = true;

    // Creating states for keeping track of the login status
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginStatus, setLoginStatus] = useState();

    // Creating state for storing data of logged in student
    const [student, setStudent] = useState();

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
                    pathname: "/student/login"
                });
            }
        })
    };

    // Invoking the getSession() function the first time the component is rendered
    useEffect(() => {
        getSession();
    }, []);

    // Function for fetching the data of logged in student
    const getStudent = async () => {
        const response = await axios.post("http://localhost:4000/getStudent", { student_id: loginStatus.id });
        console.log(response.data);
        setStudent(response.data[0]);
    }

    // Invoking the getStudent() function when the loginStatus is updated
    useEffect(() => {
        getStudent();
    }, [loginStatus]);

    // Function for signing out the user and destroying the session
    const signOut = () => {
        axios.post("http://localhost:4000/signOut").then((response) => {
            console.log(response);
            if (response.data.loggedOut) {
                history.push({
                    pathname: "/student/login"
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
                            <span className="header-subtitle pl-3">Student Portal</span>
                        </div>
                        <Link to="#" onClick={signOut} id="signout-link">Sign Out</Link>
                    </div>
                </Container>
            </div>
            {(student) ?
                {
                    'quiz': <StudentQuizzes student={student} />,
                    'attemptQuiz': <AttemptQuiz student={student} />,
                    'result': <StudentResult student={student} />,
                }[tab]
                : null
            }
        </>
    );
}

export default Student;