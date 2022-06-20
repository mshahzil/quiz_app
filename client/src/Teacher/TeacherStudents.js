// Importing styles for TeacherStudents component
import './TeacherQuizzes.css';
import './TeacherStudents.css';

// Importing useHistory for routing to different pages
import { useHistory } from 'react-router-dom';

// Importing UI components from React Bootstrap
import { Row, Col, Form, Container, Table, Modal } from 'react-bootstrap';

// Importing hooks (useState, useEffect) for state handling in functional components
import { useState, useEffect } from 'react';

// Importing axios for sending  GET/POST requests to the server
import axios from 'axios';

// Importing fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';


const TeacherStudents = ({ teacher }) => {

    const history = useHistory();
    axios.defaults.withCredentials = true;

    // Creating state for storing all students added by a teacher
    const [students, setStudents] = useState([]);

    // Function for fetching all students added by the logged in teacher
    const getStudents = () => {
        axios.get(`http://localhost:4000/getStudents/${teacher.id}`).then((response) => {
            console.log(response.data);
            setStudents(response.data);
        })
            .catch((err) => {
                console.log(err);
            });
    };

    // Invoking the getStudents() function the first time the component is rendered
    useEffect(() => {
        getStudents();
    }, []);

    // Creating states for showing/hiding the dialog box, and storing the ID of the student to be deleted
    const [showDialog, setShowDialog] = useState(false);
    const [deleteID, setDeleteID] = useState(-1);

    // Functions for showing and hiding the dialog box
    const open = () => setShowDialog(true);
    const close = () => setShowDialog(false);

    // Function for removing a student
    const deleteStudent = () => {
        close();
        axios.post("http://localhost:4000/deleteStudent", { student_id: deleteID })
            .then((response) => {
                console.log(response);
                window.location.reload();
            })
            .catch(error => console.error(`Error: ${error}`));
    };

    // Creating states for showing and hiding the 'Add Student Form'
    const [show, setShow] = useState(false);

    // Functions for showing and hiding the 'Add Student Form'
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header className='mx-auto'>
                    <Modal.Title className="modal-title">Add Students</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddStudentForm teacher={teacher} handleClose={handleClose} />
                </Modal.Body>
            </Modal>
            {showDialog && (
                <Row className="delete-alert-box py-4 px-0 mx-0">
                    <Col xs={12} className="d-flex justify-content-center px-0 mx-0"><h5>Are you sure you want to remove this student?</h5></Col>
                    <Col xs={12} className="d-flex justify-content-center px-0 mx-0">
                        <button className="quiz-delete-btn px-4 py-2 mx-2 mt-3" onClick={deleteStudent}>Yes</button>
                        <button className="quiz-delete-btn px-4 py-2 mx-2 mt-3" onClick={close}>
                            No
                        </button>
                    </Col>
                </Row>
            )}
            <Container className="content-container mt-5 py-2">
                <div className="d-flex justify-content-between align-items-center">
                    <div className='quiz-head'>All Students</div>
                    <div><button onClick={handleShow} className='new-quiz-btn'>ADD STUDENTS +</button></div>
                </div>
                <div className='table-container mt-4'>
                    <Table striped hover className="">
                        <thead>
                            <tr>
                                <th className="t-head">NAME</th>
                                <th className="t-head">ADDED ON</th>
                                {/* <th></th> */}
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                students.map((student) => {
                                    return (
                                        <>
                                            <tr>
                                                <td>{student.name}</td>
                                                <td>{student.added_on.slice(0, 10)}</td>
                                                <td><FontAwesomeIcon icon={faTrashAlt} onClick={() => { setDeleteID(student.id); open(); }} /></td>
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

export default TeacherStudents;



// Component for Adding New Student 
const AddStudentForm = ({ teacher, handleClose }) => {

    // Creating states for the name and email fields of a new student
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // Function for adding a new student
    const addStudent = () => {
        handleClose();

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;

        axios.post("http://localhost:4000/addStudent", { teacher_id: teacher.id, student_name: name, email: email, password: "123456", added_on: today })
            .then((response) => {
                console.log(response);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch(error => console.error(`Error: ${error}`));
    };

    return (
        <div className="add-form-div">
            <Form onSubmit={addStudent} className="add-form">
                <Form.Group controlId="formBasicName" className='mb-3'>
                    <Form.Label className='login-label'>NAME</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formBasicEmail" className='mb-4 pb-2'>
                    <Form.Label className='login-label'>EMAIL</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <div>
                    <button className="w-100 add-btn p-2 mb-4" type="submit" block>
                        SEND INVITATION
                    </button>
                </div>
            </Form>
        </div>
    );
};