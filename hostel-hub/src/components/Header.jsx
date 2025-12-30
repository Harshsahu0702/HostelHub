import React from "react";
import "./Header.css";
import TaglineCTA from "./TaglineCTA";
import logo from "../assets/logo.png";

export default function Header() {

  return (
    <header className="header-component">
      <div className="header-content">
        <div className="logo-box large">
          <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
        </div>
        <div className="title-section large">
          <h1 className="site-title">Hostel-<span className="hub-accent">Hub</span></h1>

        </div>

      </div>
      <TaglineCTA />
    </header>
  );
}
