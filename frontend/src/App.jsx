import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import CheatSheetsPage from "./pages/cheatsheets"
import PlacementPrep from "./pages/placementprep";
import Dashboard from "./pages/dashboard";  // ✅ Import Dashboard Component
import ProtectedRoute from "./components/protectedRoute";  // ✅ Auth Guard

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Landing Page */}
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

        {/* Auth Pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutSection />}/>
        <Route path="/cheatsheets" element={<CheatSheetsPage />}/>
        <Route path="/placementprep" element={<PlacementPrep/>}/>

        {/* ✅ Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
