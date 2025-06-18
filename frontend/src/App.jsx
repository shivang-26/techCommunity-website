import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Features from "./components/features";
import HowItWorks from "./components/howitworks";
import Testimonials from "./components/testimonials";
import CTA from "./components/CTA";
import Faq from "./components/faq";
import Footer from "./components/footer";
import Register from "./pages/register";
import Login from "./pages/login";
import AboutSection from "./pages/about";
import CheatSheetsPage from "./pages/cheatsheets";
import PlacementPrep from "./pages/placementprep";
import Forum from "./pages/forum";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/protectedRoute";
import { UserProvider } from "./context/Usercontext";
import ChangePassword from "./pages/change-password";
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await axios.get("/api/auth/me", { withCredentials: true });
      } catch (error) {
        // User not authenticated, that's okay
      } finally {
        setLoadingUser(false);
      }
    };
    
    checkUser();
  }, []);

  return (
    <BrowserRouter>
      <UserProvider>
      {/* Navbar will get user from UserContext */}
      <Navbar />

      {/* Optional: Add loading spinner if needed */}
      {!loadingUser && (
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Features />
                <HowItWorks />
                <Testimonials />
                <CTA />
                <Faq />
                <Footer />
              </>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/cheatsheets" element={<CheatSheetsPage />} />
          <Route path="/placementprep" element={<PlacementPrep />} />
          <Route path="/forum" element={<Forum />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      )}
      </UserProvider>
    </BrowserRouter>
  );
}
