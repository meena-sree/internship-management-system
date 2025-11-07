import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import StudentRegister from './pages/StudentRegister';
import CompanyRegister from './pages/CompanyRegister';
import CompanyDashboard from './pages/CompanyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import InternshipPosting from './pages/InternshipPosting';
import InternshipListings from './pages/InternshipListings';
import Notifications from './pages/Notifications';
import Offers from './pages/Offers';
import TakeTest from './pages/TakeTest';
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Navbar />
        <main className="flex-grow">
          <Routes>

            <Route path="/" element={<Login />} />
            <Route path="/student-register" element={<StudentRegister />} />
            <Route path="/company-register" element={<CompanyRegister />} />
            <Route path="/take-test/:internship_id" element={<TakeTest />} />


            {/* Protected Routes */}
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company-dashboard"
              element={
                <ProtectedRoute role="company">
                  <CompanyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/internship-posting"
              element={
                <ProtectedRoute role="company">
                  <InternshipPosting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/internships"
              element={
                <ProtectedRoute>
                  <InternshipListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/take-test"
              element={
                <ProtectedRoute role="student">
                  <TakeTest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offers"
              element={
                <ProtectedRoute role="student">
                  <Offers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={<Notifications />}
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
