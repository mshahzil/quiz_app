// Importing styles for Login component
import './Login.css';

// Importing Link and useHistory for routing to different pages
import { Link, useHistory } from 'react-router-dom';

// Importing UI components from React Bootstrap
import { Form, Button, Container } from 'react-bootstrap';

// Importing hooks (useState, useEffect) for state handling in functional components
import { useState, useEffect } from 'react';

// Importing axios for sending  GET/POST requests to the server
import axios from 'axios';

const StudentLogin = () => {

    const history = useHistory();
    axios.defaults.withCredentials = true;

    // Creating states for the email and password fields
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    // Creating states for keeping track of the login status
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginStatus, setLoginStatus] = useState();

    // Function for checking if user is logged in and updating the login status
    const getSession = () => {
        axios.get("http://localhost:4000/login").then((response) => {
            if (response.data.loggedIn) {
                console.log(response);
                setLoggedIn(response.data.loggedIn);
                setLoginStatus(response.data.user);
            }
        })
    };

    // Invoking the getSession() function the first time the component is rendered
    useEffect(() => {
        getSession();
    }, []);

    // Function for logging in using the email and password entered
    const loginUser = (e) => {
        e.preventDefault();
        const credentials = {
            email: email,
            password: password
        };
        axios.post('http://localhost:4000/studentLogin', credentials)
            .then((response) => {
                if (response.data.message) {
                    setLoggedIn(false);
                    setLoginStatus(response.data.message);
                    console.log(response.data.message);
                    document.getElementById("error-login").style.display = "block";
                }
                else {
                    setLoggedIn(true);
                    setLoginStatus(response.data);
                    document.getElementById("error-login").style.display = "none";
                    history.push({
                        pathname: "/student/quizzes",
                        state: response.data
                    })
                }
                return response;
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    };

    return (
        <>
            <div className="header">
                <Container className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className='d-flex align-items-center'>
                            <i className="fas fa-book fa-2x pr-2 mr-1"></i>
                            <span className="header-title pr-3">Quiz App</span>
                            <span className="header-subtitle pl-3">Student Portal</span>
                        </div>
                        <Link to="/" className='portal-link'>Teacher Portal</Link>
                    </div>
                </Container>
            </div>
            <div className="outDiv">
                <div className="formDiv">
                    <h2 className="formHeading pb-4">Log in to Quiz App</h2>
                    <Form method="POST" onSubmit={loginUser}>
                        <Form.Group>
                            <Form.Label className='login-label'>EMAIL</Form.Label>
                            <Form.Control required type="email" name="email" placeholder="" onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <br />
                        <Form.Group>
                            <Form.Label className='login-label'>PASSWORD</Form.Label>
                            <Form.Control required type="password" name="password" placeholder="" onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>

                        <div className='login-form-links'>Forgot Password?</div>
                        <br />
                        <Button className="w-100 login-btn mb-2" type="submit" name="signIn">LOGIN</Button>
                    </Form>
                    <small className='mt-2' id="error-login">Invalid Email or Password!</small>
                </div>
            </div>
        </>
    );
}

export default StudentLogin;