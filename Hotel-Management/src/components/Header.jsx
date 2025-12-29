import React from "react";
import "./Header.css";
import TaglineCTA from "./TaglineCTA";
export default function Header() {
   
  return (
    <header className="header-component">
      <div className="header-content">
        <div className="logo-box large">HC</div>
        <div className="title-section large">
          <h1 className="site-title">Hostel-<span className="hub-accent">Hub</span></h1>
        
        </div>
        
      </div>
      <TaglineCTA />  
    </header>
  );
}
