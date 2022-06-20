// Importing styles for App component
import './App.css';

// Importing Router for routing to different pages for different links
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Importing components
import Login from './Authentication/Login';
import SignUp from './Authentication/SignUp';
import Teacher from './Teacher/Teacher';
import StudentLogin from './Authentication/StudentLogin';
import Student from './Student/Student';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/signUp">
          <SignUp />
        </Route>
        <Route path="/teacher/students">
          <Teacher tab="students" />
        </Route>
        <Route path="/teacher/quizzes">
          <Teacher tab="quiz" />
        </Route>
        <Route path="/teacher/addQuiz">
          <Teacher tab="addQuiz" />
        </Route>
        <Route path="/teacher/editQuiz">
          <Teacher tab="editQuiz" />
        </Route>
        <Route path="/teacher/quizResults">
          <Teacher tab="quizResults" />
        </Route>
        <Route exact path="/student/login">
          <StudentLogin />
        </Route>
        <Route exact path="/student/quizzes">
          <Student tab="quiz" />
        </Route>
        <Route exact path="/student/attemptQuiz">
          <Student tab="attemptQuiz" />
        </Route>
        <Route exact path="/student/result">
          <Student tab="result" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;