// Importing styles for SignUp component
import './Login.css';
import './SignUp.css';

// Importing Link and useHistory for routing to different pages
import { Link, useHistory } from 'react-router-dom';

// Importing UI components from React Bootstrap
import { Container, Form, Button } from 'react-bootstrap';

// Importing hooks (useState, useEffect) for state handling in functional components
import { useState, useEffect } from 'react';

// Importing axios for sending  GET/POST requests to the server
import axios from 'axios';

const SignUp = () => {

    const history = useHistory();
    axios.defaults.withCredentials = true;

    // Creating states for name, email, password and confirmPassword fields
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

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

    // Function for creating a new teacher account using the details entered
    const addTeacher = (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            document.getElementById('pass-error').style.visibility = 'visible';
            document.getElementById('pass-error').style.color = 'red';
            document.getElementById('pass-error').innerHTML = "Passwords do not match!";
            return;
        }

        document.getElementById('pass-error').style.visibility = 'hidden';
        var obj = {
            name: name,
            email: email,
            password: password
        };

        axios.post('http://localhost:4000/signUp', obj)
            .then((res) => {
                console.log(res.data);
                document.getElementById('pass-error').style.visibility = 'visible';
                if (res.data.successful) {
                    document.getElementById('pass-error').style.color = 'green';
                    document.getElementById('pass-error').innerHTML = res.data.message;
                    setTimeout(() => {
                        history.push({
                            pathname: "/"
                        });
                    }, 3000);
                }
                else {
                    document.getElementById('pass-error').style.color = 'red';
                    document.getElementById('pass-error').innerHTML = res.data.message;
                }
            }).catch((err) => {
                console.log(err);
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
                            <span className="header-subtitle pl-3">Teacher Portal</span>
                        </div>
                    </div>
                </Container>
            </div>
            <div className="outDiv2">
                <div className="formDiv">
                    <h2 className="formHeading pb-4">Sign Up into Quiz App</h2>
                    <Form method="POST" onSubmit={addTeacher}>
                        <Form.Group>
                            <Form.Label className='login-label'>FULL NAME</Form.Label>
                            <Form.Control required type="text" name="name" placeholder="" onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <br />
                        <Form.Group>
                            <Form.Label className='login-label'>EMAIL</Form.Label>
                            <Form.Control required type="email" name="email" placeholder="" onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <br />
                        <Form.Group>
                            <Form.Label className='login-label'>PASSWORD</Form.Label>
                            <Form.Control required type="password" name="password" placeholder="" onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <br />
                        <Form.Group>
                            <Form.Label className='login-label'>CONFIRM PASSWORD</Form.Label>
                            <Form.Control required type="password" name="confirm-password" placeholder="" onChange={(e) => setConfirmPassword(e.target.value)} />
                        </Form.Group>
                        <br />
                        <Button className="w-100 login-btn mb-2 mt-2" type="submit" name="signIn">SIGN UP</Button>
                    </Form>
                    <span className='login-form-links'>Already have an Account? <Link to="/">Login here</Link></span>
                    <small id="pass-error">Passwords do not match!</small>
                </div>
            </div>
        </>
    );
}

export default SignUp;