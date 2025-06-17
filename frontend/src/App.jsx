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
import ChatbotInterface from './features/chatbot/ChatbotInterface';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    axios
      .get("${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setLoadingUser(false);
      })
      .catch(() => {
        setUser(null);
        setLoadingUser(false);
      });
  }, []);

  // Add this console log
  console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <UserProvider>
        {/* Pass user and setUser to Navbar */}
        <Navbar user={user} setUser={setUser} />

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
            <Route path="/chatbot" element={<ChatbotInterface />} />
          </Routes>
        )}
        </UserProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
