import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/Projects';
import AdminNewProject from './pages/admin/NewProject';
import AdminProfile from './pages/admin/Profile';
import AdminLayout from './components/admin/AdminLayout';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-guru-bg text-text-primary font-sans selection:bg-accent-indigo/30">
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CustomCursor />}
      
      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/new" element={<AdminNewProject />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="messages" element={<div>Messages</div>} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
}
