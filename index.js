// Importing express module
const express = require('express');

// Importing MySQL driver
const mysql = require('mysql');

// Importing body-parser to access req.body
const bodyParser = require('body-parser');

// Importing express-session to create and destroy user login sessions
const session = require('express-session');

// Importing bcryptjs for encrypting and decrypting passwords
const bcrypt = require('bcryptjs');

// Initializing a new express app
const app = express();

// Initializng PORT for the server to listen on
const PORT = 4000;

// Cross Origin Resource Sharing - relax security applied to the API
const cors = require('cors');
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}))

// MiddleWare
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Sessions
app.use(session({
    key: "userId",
    secret: "session",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 2000 * 60 * 1000
    }
}));

// Initialize the MySQL Database connection for localhost
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: "quiz_app",
    timezone: "+00:00"
});

// Connect to the Database
connection.connect((err) => {
    if (err) {
        console.log("Error: ", err);
    }
    console.log("Successfully connected to MySQL...");
});

// Server listening on the specified PORT
app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server is successfully running and the App is listening on port " + PORT)
    }
    else {
        console.log("Error occured, server was unable to start: ", error);
    }
});

// Fetch teacher data using teacher_id
app.post('/getTeacher', async (req, res) => {
    const teacher_id = req.body.teacher_id;
    let sql = `SELECT * FROM teacher WHERE id = ${teacher_id}`;
    connection.query(sql, async (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//Fetch all quizzes of a particular teacher
app.get('/getQuizzes/:teacherId', (req, res) => {
    const teacherID = req.params.teacherId;
    let sql = `SELECT * FROM quiz WHERE teacher_id=${teacherID}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});

//Fetch quiz data using quiz_id
app.get('/getQuiz/:quizId', (req, res) => {
    const quizID = req.params.quizId;
    let sql = `SELECT * FROM quiz WHERE id=${quizID}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});

// Add New Quiz
app.post('/addQuiz', (req, res) => {
    const teacher_id = req.body.teacher_id;
    const quiz_name = req.body.quiz_name;
    const questions = req.body.questions;
    const num_questions = req.body.num_questions;

    let quiz = { teacher_id: teacher_id, name: quiz_name, number_of_submissions: 0, total_marks: num_questions, total_questions: num_questions };
    let sql = 'INSERT INTO quiz SET ?';
    let query = connection.query(sql, quiz, (err, result) => {
        if (err) throw err;

        const quiz_id = result.insertId;
        let values = [];
        for (let i = 0; i < questions.length; i++) {
            let temp = [];
            temp[0] = quiz_id;
            temp[1] = questions[i].question;
            temp[2] = questions[i].optionA;
            temp[3] = questions[i].optionB;
            temp[4] = questions[i].optionC;
            temp[5] = questions[i].optionD;
            temp[6] = questions[i].correct;
            values.push(temp);
        }

        let sql2 = `INSERT INTO question (quiz_id, question, option_a, option_b, option_c, option_d, correct_option) VALUES ?`;
        connection.query(sql2, [values], (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
});

// Delete quiz and delete all questions associated with the quiz   
app.post('/deleteQuiz', async (req, res) => {
    const quiz_id = req.body.quiz_id;
    let sql1 = `DELETE FROM question WHERE quiz_id = ${quiz_id}`;
    connection.query(sql1, (err, result) => {
        if (err) throw err;
        let sql2 = `DELETE FROM quiz WHERE id = ${quiz_id}`;
        connection.query(sql2, async (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
});

//Update Existing Quiz
app.post('/updateQuiz', async (req, res) => {
    const quiz_id = req.body.quiz_id;
    const quiz_name = req.body.quiz_name;
    const num_questions = req.body.num_questions;
    const questions = req.body.questions;

    let sql1 = `UPDATE quiz SET name='${quiz_name}', total_questions='${num_questions}', total_marks='${num_questions}' WHERE id=${quiz_id}`;
    connection.query(sql1, (err, result) => {
        if (err) throw err;

        let sql2 = `DELETE FROM question WHERE quiz_id=${quiz_id}`;
        connection.query(sql2, (err, result) => {
            if (err) throw err;

            let values = [];
            for (let i = 0; i < questions.length; i++) {
                let temp = [];
                temp[0] = quiz_id;
                temp[1] = questions[i].question;
                temp[2] = questions[i].option_a;
                temp[3] = questions[i].option_b;
                temp[4] = questions[i].option_c;
                temp[5] = questions[i].option_d;
                temp[6] = questions[i].correct_option;
                values.push(temp);
            }

            let sql3 = `INSERT INTO question (quiz_id, question, option_a, option_b, option_c, option_d, correct_option) VALUES ?`;
            connection.query(sql3, [values], (err, result) => {
                if (err) throw err;
                res.send(result);
            });
        });
    });
});

//Fetch all questions of a particular quiz
app.get('/getQuestions/:quizId', (req, res) => {
    const quizID = req.params.quizId;
    let sql = `SELECT * FROM question WHERE quiz_id=${quizID}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});

//Fetch all results of a particular quiz
app.get('/getQuizResults/:quizId', (req, res) => {
    const quizID = req.params.quizId;
    let sql = `SELECT R.id, R.submitted_on, R.obtained_marks, R.total_marks, S.name FROM result R, student S WHERE R.quiz_id=${quizID} AND R.student_id=S.id`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});

// Save Quiz Result
app.post('/saveQuizResult', (req, res) => {
    const quiz_id = req.body.quiz_id;
    const student_id = req.body.student_id;
    const submitted_on = req.body.submitted_on;
    const obtained_marks = req.body.obtained_marks;
    const total_marks = req.body.total_marks;

    let sql1 = `DELETE FROM result WHERE quiz_id=${quiz_id} AND student_id=${student_id}`;
    connection.query(sql1, (err, result) => {
        if (err) throw err;

        let quiz_result = { quiz_id: quiz_id, student_id: student_id, submitted_on: submitted_on, obtained_marks: obtained_marks, total_marks: total_marks };
        let sql2 = 'INSERT INTO result SET ?';
        connection.query(sql2, quiz_result, (err, result) => {
            if (err) throw err;

            let sql3 = `SELECT number_of_submissions FROM quiz WHERE id=${quiz_id}`;
            connection.query(sql3, (err, result) => {
                if (err) throw err;

                number_of_submissions = result[0].number_of_submissions + 1;
                let sql4 = `UPDATE quiz SET number_of_submissions='${number_of_submissions}' WHERE id=${quiz_id}`;
                connection.query(sql4, (err, result) => {
                    if (err) throw err;
                    res.send(result);
                });
            });
        });
    });
});

// Delete Quiz Result
app.post('/deleteQuizResult', async (req, res) => {
    const result_id = req.body.result_id;
    const quiz_id = req.body.quiz_id;

    let sql = `DELETE FROM result WHERE id = ${result_id}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;

        let sql2 = `SELECT number_of_submissions FROM quiz WHERE id=${quiz_id}`;
        connection.query(sql2, (err, result) => {
            if (err) throw err;

            number_of_submissions = result[0].number_of_submissions - 1;
            let sql3 = `UPDATE quiz SET number_of_submissions='${number_of_submissions}' WHERE id=${quiz_id}`;
            connection.query(sql3, (err, result) => {
                if (err) throw err;
                res.send(result);
            });
        });
    });
});

//Fetch all students of a particular teacher
app.get('/getStudents/:teacherId', (req, res) => {
    const teacherID = req.params.teacherId;
    let sql = `SELECT * FROM student WHERE teacher_id=${teacherID}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});

// Add New Student
app.post('/addStudent', (req, res) => {
    const teacher_id = req.body.teacher_id;
    const student_name = req.body.student_name;
    const email = req.body.email;
    const added_on = req.body.added_on;

    const password = req.body.password;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    let student = { teacher_id: teacher_id, name: student_name, email: email, password: hash, added_on: added_on };
    let sql = 'INSERT INTO student SET ?';

    connection.query(sql, student, (err, result) => {
        if (err) throw err;
        console.log(result);
    });
});


// Delete Student Data
app.post('/deleteStudent', async (req, res) => {
    const student_id = req.body.student_id;
    let sql = `DELETE FROM student WHERE id = ${student_id}`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});


// Fetch Student Data using student_id
app.post('/getStudent', async (req, res) => {
    const student_id = req.body.student_id;
    let sql = `SELECT * FROM student WHERE id = ${student_id}`;
    connection.query(sql, async (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

// Fetch all quizzes and results of a particular student
app.get('/getStudentQuizzes/:teacherId/:studentId', (req, res) => {
    const teacherID = req.params.teacherId;
    const studentID = req.params.studentId;

    let sql = `SELECT Q.id as id, Q.name as quiz_name, T.name as teacher_name, R.obtained_marks as obtained_marks, Q.total_marks as total_marks FROM quiz Q LEFT JOIN result R ON Q.id=R.quiz_id AND Q.teacher_id=${teacherID} AND R.student_id=${studentID} INNER JOIN teacher T ON T.id=Q.teacher_id`;

    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);
    })
});

// Get User Login Session
app.get('/login', (req, res) => {
    if (req.session.user) {
        res.send({
            loggedIn: true,
            user: req.session.user
        });
    }
    else {
        res.send({ loggedIn: false })
    }
});

// Teacher Login
app.post('/login', (req, res) => {
    try {
        console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;

        let sql = `SELECT * FROM teacher WHERE email='${email}'`;

        connection.query(sql, (err, result) => {
            if (err) throw err;
            if (result && result.length > 0) {
                if (bcrypt.compareSync(password, result[0].password)) {
                    console.log('Both email and password match!');

                    // To prevent password from being visible on the front-end
                    result[0].password = undefined;

                    req.session.user = result[0];
                    res.send(result[0]);
                }
                else {
                    res.send({
                        message: 'Incorrect Email or Password'
                    });
                }
            }
            else {
                res.send({
                    message: 'Incorrect Email or Password'
                });
            }
        });
    }
    catch (ex) {
        console.log("Error: " + ex);
        res.send({
            message: "Error: " + ex
        });
    }
});

// Teacher Sign Up
app.post('/signUp', (req, res) => {
    try {
        console.log(req.body);

        const name = req.body.name
        const email = req.body.email;

        const password = req.body.password;
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);

        let sql = `INSERT INTO teacher (name, email, password) VALUES ('${name}', '${email}', '${hash}')`;
        connection.query(sql, (err, result) => {
            if (err) throw err;
            res.send({ successful: true, message: "Sign Up Successful!" });
        })
    }
    catch (err) {
        console.log(err);
        res.send({ successful: false, message: "Sign Up failed!" });
    }
});

// Student Login
app.post('/studentLogin', (req, res) => {
    try {
        console.log(req.body);
        const email = req.body.email;
        const password = req.body.password;

        let sql = `SELECT * FROM student WHERE email='${email}'`;

        connection.query(sql, (err, result) => {
            if (err) throw err;
            if (result && result.length > 0) {
                if (bcrypt.compareSync(password, result[0].password)) {
                    console.log('Both email and password match!');

                    // To prevent password from being visible on the front-end
                    result[0].password = undefined;

                    req.session.user = result[0];
                    res.send(result[0]);
                }
                else {
                    res.send({
                        message: 'Incorrect Email or Password'
                    });
                }
            }
            else {
                res.send({
                    message: 'Incorrect Email or Password'
                });
            }
        });
    }
    catch (ex) {
        console.log("Error: " + ex);
        res.send({
            message: "Error: " + ex
        });
    }
});

// Sign Out and Destroy User Login Session 
app.post('/signOut', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send({ loggedOut: false, message: "Unable to log out!" });
            }
            else {
                res.send({ loggedOut: true, message: "Logout successful" });
            }
        });
    }
    else {
        res.end();
    }
});
