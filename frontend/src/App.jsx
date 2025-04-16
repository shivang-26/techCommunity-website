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

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setLoadingUser(false);
      })
      .catch(() => {
        setUser(null);
        setLoadingUser(false);
      });
  }, []);

  return (
    <BrowserRouter>
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
        </Routes>
      )}
    </BrowserRouter>
  );
}
