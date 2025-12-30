import React, { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./HostelLoginToggle.css";
import Header from "../components/Header";
import Hyperspeed from "../components/Hyperspeed";
import { hyperspeedPresets } from "../components/hyperspeedPresets";
import HowItWorks from "./HowItWorksSection";
import WhyChooseSection from "../components/WhyChooseSection";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HostelButton from "../components/HostelButton"
import Contact from "../components/Contact";
import ScrollIndicator from "../components/ScrollIndicator";

export default function HostelLoginToggle() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("student");

  // Refs for form inputs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (mode === "student") {
        const studentCreds = {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        };

        const res = await axios.post(
          "https://hostelhub-it51.onrender.com/api/auth/student/login",
          studentCreds
        );

        // ✅ STORE JWT
        if (res?.data?.token) {
          localStorage.setItem("token", res.data.token);
        }

        // persist student profile
        if (res?.data?.data) {
          localStorage.setItem("studentData", JSON.stringify(res.data.data));
        }


        // persist student profile so app can load StudentContext
        if (res?.data?.data) {
          localStorage.setItem('studentData', JSON.stringify(res.data.data));
        }
        navigate("/student-dashboard");

      } else {
        const adminCreds = {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        };

        const res = await axios.post(
          "https://hostelhub-it51.onrender.com/api/auth/admin/login",
          adminCreds
        );

        // ✅ STORE JWT
        if (res?.data?.token) {
          localStorage.setItem("token", res.data.token);
        }

        // persist email
        localStorage.setItem("adminEmail", adminCreds.email);

        // persist email locally so dashboard can load profile even after refresh
        localStorage.setItem('adminEmail', adminCreds.email);
        navigate("/admin-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };


  return (
    <>
      {/* HERO + LOGIN SECTION */}
      <div className="hero-section-wrapper">

        <div className="login-container">
          {/* BG Animation */}
          <div className="hyperspeed-bg">
            <Hyperspeed effectOptions={hyperspeedPresets.one} />
          </div>

          {/* FLOATING BLOBS */}
          <div className="blob-left"></div>
          <div className="blob-right"></div>

          {/* HEADER */}
          <Header />


          {/* LOGIN BOX */}
          <div className="login-wrapper" style={{ position: 'relative' }}>
            <ScrollIndicator />

            {/* TOGGLE */}
            <div className="toggle-container">
              <div
                className={`toggle-background ${mode === "admin" ? "admin" : "student"}`}
              ></div>

              <div className="toggle-buttons">
                <button
                  onClick={() => setMode("admin")}
                  className={`toggle-btn ${mode === "admin" ? "active" : "inactive"}`}
                >
                  Admin
                </button>

                <button
                  onClick={() => setMode("student")}
                  className={`toggle-btn ${mode === "student" ? "active" : "inactive"}`}
                >
                  Student
                </button>
              </div>
            </div>

            {/* LOGIN FORM */}
            <div className="form-wrapper">
              <div className="form-card">
                <h2 className="form-title">Welcome back</h2>
                <p className="form-subtitle">Sign in to continue</p>

                <AnimatePresence mode="wait">
                  {mode === "student" ? (
                    <motion.form
                      key="student"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={submitHandler}
                    >
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                          required
                          type="email"
                          name="email"
                          ref={emailRef}
                          placeholder="student@college.edu"
                          className="form-input student-focus"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                          required
                          type="password"
                          name="password"
                          ref={passwordRef}
                          placeholder="••••••••"
                          className="form-input student-focus"
                        />
                      </div>

                      <button className="submit-btn student">Sign in</button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="admin"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={submitHandler}
                    >
                      <div className="form-group">
                        <label className="form-label">Admin Email</label>
                        <input
                          required
                          type="email"
                          name="email"
                          ref={emailRef}
                          placeholder="admin@college.edu"
                          className="form-input admin-focus"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                          required
                          type="password"
                          name="password"
                          ref={passwordRef}
                          placeholder="••••••••"
                          className="form-input admin-focus"
                        />
                      </div>


                      <button className="submit-btn admin">Admin Sign in</button>
                    </motion.form>

                  )}

                </AnimatePresence>
              </div>

            </div>
            <HostelButton />
            <Contact />
          </div>

        </div>

      </div>

      {/* HOW IT WORKS SECTION */}
      <HowItWorks />

      {/* WHY CHOOSE HOSTEL-HUB SECTION (CURVED TOP) */}
      <WhyChooseSection />
    </>
  );

}
