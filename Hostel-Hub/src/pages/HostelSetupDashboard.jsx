import { useNavigate } from "react-router-dom";

import React, { useState, useEffect } from 'react';
import { saveHostelDraft, completeHostelSetup, createSuperAdmin } from '../services/api';

// --- Internal SVG Icon Components for Zero-Dependency ---
const Icons = {
  Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Building: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22"></line><line x1="15" y1="22" x2="15" y2="22"></line><line x1="12" y1="22" x2="12" y2="22"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>,
  Grid: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Zap: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  ChevronRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
  ChevronLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  Save: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>,
  Refresh: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>,
  Utensils: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"></path></svg>
};

const HostelSetupDashboard = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [validationError, setValidationError] = useState(''); // State for Red Alert
  const [hostelId, setHostelId] = useState(null);

  // --- Central State Management ---
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    hostelName: '',
    hostelAddress: '',
    hostelContact: '',
    hostelEmail: '',
    hostelType: 'co-ed',

    // Step 2: Admin Creds
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminConfirmPassword: '',

    // Step 3: Buildings
    buildings: [
      { id: 1, name: 'Main Block', floors: 3, roomsPerFloor: 10 }
    ],

    // Step 4: Room Matrix (Generated)
    generatedRooms: [],

    // Internal reference for dropdowns (expanded to match student preference options)
    roomTypes: {
      'Single (AC)': { capacity: 1 },
      'Single (Non-AC)': { capacity: 1 },
      'Double (AC)': { capacity: 2 },
      'Double (Non-AC)': { capacity: 2 },
      'Triple (AC)': { capacity: 3 },
      'Triple (Non-AC)': { capacity: 3 },
      'Quadruple (AC)': { capacity: 4 },
      'Quadruple (Non-AC)': { capacity: 4 },
    },

    // Step 5: Mess
    messAvailable: true,
  });

  // --- Logic to Generate Rooms Table ---
  useEffect(() => {
    // Generate only if on Room Matrix step (now Step 4) and list is empty
    if (activeStep === 4 && formData.generatedRooms.length === 0) {
      regenerateRooms();
    }
  }, [activeStep]);

  // --- Auto-dismiss Alert Effect ---
  useEffect(() => {
    if (validationError) {
      const timer = setTimeout(() => {
        setValidationError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [validationError]);

  // --- Load Hostel ID from Local Storage on Mount ---
  useEffect(() => {
    const savedHostelId = localStorage.getItem("hostelId");
    if (savedHostelId) setHostelId(savedHostelId);
  }, []);


  const regenerateRooms = () => {
    const newRooms = [];
    let idCounter = 1;

    formData.buildings.forEach(building => {
      for (let f = 1; f <= building.floors; f++) {
        for (let r = 1; r <= building.roomsPerFloor; r++) {
          // Logic for room number: Block First Char + Floor + Room (e.g., M-101)
          const roomSuffix = r < 10 ? `0${r}` : `${r}`;
          const roomNum = `${building.name.charAt(0).toUpperCase()}-${f}${roomSuffix}`;

          const defaultType = Object.keys(formData.roomTypes).includes('Double (Non-AC)')
            ? 'Double (Non-AC)'
            : Object.keys(formData.roomTypes)[0];
          newRooms.push({
            id: idCounter++,
            roomNumber: roomNum,
            buildingId: building.id,
            buildingName: building.name,
            floor: f,
            type: defaultType,
            capacity: formData.roomTypes[defaultType]?.capacity || 2,
            occupied: false,
            active: true
          });
        }
      }
    });
    setFormData(prev => ({ ...prev, generatedRooms: newRooms }));
  };

  const handleRoomUpdate = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      generatedRooms: prev.generatedRooms.map(room => {
        if (room.id === id) {
          const updatedRoom = { ...room, [field]: value };
          // If type changes, auto-update capacity based on default map
          if (field === 'type') {
            updatedRoom.capacity = prev.roomTypes[value]?.capacity || 0;
          }
          return updatedRoom;
        }
        return room;
      })
    }));
  };

  const handleDeleteRoom = (id) => {
    setFormData(prev => ({
      ...prev,
      generatedRooms: prev.generatedRooms.filter(r => r.id !== id)
    }));
  };

  const saveRoomConfiguration = () => {
    const validRooms = formData.generatedRooms.filter(r => r.active);
    console.log("Saving Configuration...", {
      total: validRooms.length,
      available: validRooms.filter(r => !r.occupied).length,
      data: validRooms
    });
    alert(`Configuration Saved! ${validRooms.length} active rooms configured.`);
  };

  // --- Helper Functions ---
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBuildingChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      buildings: prev.buildings.map(b => b.id === id ? { ...b, [field]: value } : b)
    }));
  };

  const addBuilding = () => {
    const newId = formData.buildings.length + 1;
    setFormData(prev => ({
      ...prev,
      buildings: [...prev.buildings, { id: newId, name: `Block ${String.fromCharCode(65 + prev.buildings.length)}`, floors: 2, roomsPerFloor: 5 }]
    }));
  };

  const removeBuilding = (id) => {
    if (formData.buildings.length > 1) {
      setFormData(prev => ({
        ...prev,
        buildings: prev.buildings.filter(b => b.id !== id)
      }));
    }
  };

  // --- Validation & Navigation Handlers ---
  const totalSteps = 6;

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.hostelName.trim() !== '' &&
          formData.hostelAddress.trim() !== '' &&
          formData.hostelContact.trim() !== '' &&
          formData.hostelEmail.trim() !== '';
      case 2:
        return formData.adminName.trim() !== '' &&
          formData.adminEmail.trim() !== '' &&
          formData.adminPassword.trim() !== '' &&
          formData.adminConfirmPassword.trim() !== '' &&
          formData.adminPassword === formData.adminConfirmPassword;
      case 3:
        return formData.buildings.length > 0 &&
          formData.buildings.every(b => b.name.trim() !== '' && b.floors > 0 && b.roomsPerFloor > 0);
      case 4:
        return formData.generatedRooms.length > 0;
      case 5:
        return true; // Checkbox only, safe to proceed
      default:
        return true;
    }
  };

  const nextStep = async () => {
    if (!validateStep(activeStep)) {
      setValidationError("Please fill in all required fields before proceeding.");
      return;
    }

    try {
      // STEP 1: Save Basic Info & CREATE HOSTEL
      if (activeStep === 1) {
        const { adminName, adminEmail, adminPassword, adminConfirmPassword, ...draftData } = formData;

        const res = await saveHostelDraft(1, draftData);

        // Check if response is successful and has hostelId
        if (res.success && res.hostelId) {
          setHostelId(res.hostelId);
          localStorage.setItem("hostelId", res.hostelId);
          setActiveStep(2);
        } else {
          setValidationError("Failed to save hostel information. Please try again.");
          return;
        }
        return;
      }

      // STEP 2: Create Admin (NO save-draft here)
      if (activeStep === 2) {
        const storedHostelId = hostelId || localStorage.getItem("hostelId");

        if (!storedHostelId) {
          setValidationError("Hostel ID missing. Please save Basic Info first.");
          return;
        }

        const adminRes = await createSuperAdmin({
          name: formData.adminName,
          email: formData.adminEmail,
          password: formData.adminPassword,
          hostelId: storedHostelId,
        });

        if (adminRes.success) {
          setActiveStep(3);
        } else {
          setValidationError(adminRes.message || "Failed to create admin account.");
          return;
        }
        return;
      }

      // STEPS 3, 4, 5 → save-draft with hostelId
      const { adminName, adminEmail, adminPassword, adminConfirmPassword, ...draftData } = formData;

      const draftRes = await saveHostelDraft(
        activeStep,
        draftData,
        hostelId || localStorage.getItem("hostelId"),
      );

      if (draftRes.success) {
        if (activeStep < totalSteps) {
          setActiveStep(prev => prev + 1);
        }
      } else {
        setValidationError(draftRes.message || "Failed to save progress.");
      }
    } catch (err) {
      console.error("Operation failed", err);
      setValidationError(err.response?.data?.message || err.message || "An error occurred.");
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(prev => prev - 1);
      setValidationError(''); // Clear validation error when going back
    }
  };

  const completeSetup = async () => {
    try {
      const res = await completeHostelSetup(hostelId);

      console.log("Server Response:", res.data);
      setIsCompleted(true);
    } catch (error) {
      console.error("Setup failed:", error);
      alert("Failed to save hostel setup");
    }
  };

  // --- Render Steps ---
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="step-container fade-in">
            <h2 className="step-title">Hostel Basic Information</h2>
            <p className="step-subtitle">Let's start by establishing the identity of your hostel.</p>

            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Hostel Name</label>
                <input type="text" className="form-input" placeholder="e.g. St. Xavier's Elite Hostel" value={formData.hostelName} onChange={(e) => handleInputChange('hostelName', e.target.value)} />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Address</label>
                <input type="text" className="form-input" placeholder="Full street address" value={formData.hostelAddress} onChange={(e) => handleInputChange('hostelAddress', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input type="tel" className="form-input" placeholder="+91 00000 00000" value={formData.hostelContact} onChange={(e) => handleInputChange('hostelContact', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Official Email</label>
                <input type="email" className="form-input" placeholder="admin@hostel.com" value={formData.hostelEmail} onChange={(e) => handleInputChange('hostelEmail', e.target.value)} />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Hostel Type</label>
                <div className="radio-group">
                  {['boys', 'girls', 'co-ed'].map(type => (
                    <div key={type} className={`radio-card ${formData.hostelType === type ? 'selected' : ''}`} onClick={() => handleInputChange('hostelType', type)}>
                      <div className="radio-circle">
                        {formData.hostelType === type && <div className="radio-dot"></div>}
                      </div>
                      <span className="radio-label">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-container fade-in">
            <h2 className="step-title">Admin Credentials</h2>
            <p className="step-subtitle">Create the Super Admin account for managing the system.</p>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Admin Full Name</label>
                <input type="text" className="form-input" value={formData.adminName} onChange={(e) => handleInputChange('adminName', e.target.value)} />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Admin Email</label>
                <input type="email" className="form-input" value={formData.adminEmail} onChange={(e) => handleInputChange('adminEmail', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" value={formData.adminPassword} onChange={(e) => handleInputChange('adminPassword', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-input" value={formData.adminConfirmPassword} onChange={(e) => handleInputChange('adminConfirmPassword', e.target.value)} />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-container fade-in">
            <h2 className="step-title">Buildings Setup</h2>
            <p className="step-subtitle">Configure the physical blocks of your property.</p>
            <div className="buildings-list">
              {formData.buildings.map((building, index) => (
                <div key={building.id} className="building-card">
                  <div className="building-header">
                    <span className="building-badge">Building {index + 1}</span>
                    <button className="btn-icon danger" onClick={() => removeBuilding(building.id)}><Icons.Trash /></button>
                  </div>
                  <div className="form-grid compact">
                    <div className="form-group">
                      <label className="form-label">Building Name</label>
                      <input type="text" className="form-input" value={building.name} onChange={(e) => handleBuildingChange(building.id, 'name', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Floors</label>
                      <input type="number" className="form-input" value={building.floors} onChange={(e) => handleBuildingChange(building.id, 'floors', parseInt(e.target.value))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Rooms/Floor</label>
                      <input type="number" className="form-input" value={building.roomsPerFloor} onChange={(e) => handleBuildingChange(building.id, 'roomsPerFloor', parseInt(e.target.value))} />
                    </div>
                    <div className="building-summary">
                      <strong>Total Rooms:</strong> {building.floors * building.roomsPerFloor}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-secondary full-width" onClick={addBuilding}>
              <Icons.Plus /> Add Another Building
            </button>
          </div>
        );

      case 4:
        return (
          <div className="step-container fade-in full-width-step">
            <div className="step-header-row">
              <div>
                <h2 className="step-title">Room Matrix Configuration</h2>
                <p className="step-subtitle">Manage individual room details, occupancy, and status.</p>
              </div>
              <div className="header-actions-row">
                <button className="btn-secondary small" onClick={regenerateRooms} title="Reset">
                  <Icons.Refresh /> Regenerate
                </button>
                <button className="btn-primary small" onClick={saveRoomConfiguration}>
                  <Icons.Save /> Save Configuration
                </button>
              </div>
            </div>

            <div className="matrix-stats-bar">
              <div className="stat-pill">Total: <strong>{formData.generatedRooms.length}</strong></div>
              <div className="stat-pill">Active: <strong>{formData.generatedRooms.filter(r => r.active).length}</strong></div>
              <div className="stat-pill">Occupied: <strong>{formData.generatedRooms.filter(r => r.occupied).length}</strong></div>
            </div>

            <div className="room-matrix-wrapper">
              <table className="room-matrix-table">
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Room No</th>
                    <th>Block</th>
                    <th style={{ width: '80px' }}>Floor</th>
                    <th>Room Type</th>
                    <th style={{ width: '80px' }}>Cap.</th>
                    <th style={{ textAlign: 'center' }}>Occupied</th>
                    <th style={{ textAlign: 'center' }}>Active</th>
                    <th style={{ width: '60px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.generatedRooms.map((room) => (
                    <tr key={room.id} className={!room.active ? 'row-inactive' : ''}>
                      <td>
                        <input
                          type="text"
                          className="table-input"
                          value={room.roomNumber}
                          onChange={(e) => handleRoomUpdate(room.id, 'roomNumber', e.target.value)}
                        />
                      </td>
                      <td>{room.buildingName}</td>
                      <td>{room.floor}</td>
                      <td>
                        <select
                          className="table-select"
                          value={room.type}
                          onChange={(e) => handleRoomUpdate(room.id, 'type', e.target.value)}
                        >
                          {Object.keys(formData.roomTypes).map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </td>
                      <td className="text-center">{room.capacity}</td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          className="table-checkbox"
                          checked={room.occupied}
                          onChange={(e) => handleRoomUpdate(room.id, 'occupied', e.target.checked)}
                          disabled={!room.active}
                        />
                      </td>
                      <td className="text-center">
                        <label className="switch-mini">
                          <input
                            type="checkbox"
                            checked={room.active}
                            onChange={(e) => handleRoomUpdate(room.id, 'active', e.target.checked)}
                          />
                          <span className="slider-mini round"></span>
                        </label>
                      </td>
                      <td className="text-center">
                        <button className="btn-icon-mini danger" onClick={() => handleDeleteRoom(room.id)}>
                          <Icons.Trash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {formData.generatedRooms.length === 0 && (
                <div className="empty-state">No rooms generated. Check building config.</div>
              )}
            </div>
          </div>
        );

      case 5:
        // Formerly Step 6, now Step 5. Removed Electricity and Water.
        return (
          <div className="step-container fade-in">
            <h2 className="step-title">Mess Facility</h2>
            <p className="step-subtitle">Configure food and dining options.</p>
            <div className="settings-list">
              <div className="setting-card">
                <div className="setting-header">
                  <div className="setting-icon"><Icons.Utensils /></div>
                  <div className="setting-details">
                    <h4>Mess Facility Available</h4>
                    <p>Enable if the hostel provides food services to residents.</p>
                  </div>
                  <div className="toggle-switch">
                    <input type="checkbox" id="mess" checked={formData.messAvailable} onChange={(e) => handleInputChange('messAvailable', e.target.checked)} />
                    <label htmlFor="mess" className="toggle-label"></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        // Formerly Step 8, now Step 6. Removed Rules and Policy checks.
        return (
          <div className="step-container fade-in">
            <h2 className="step-title">Review & Finish</h2>
            <p className="step-subtitle">Verify your configuration before launching.</p>
            <div className="review-summary">
              <div className="summary-section">
                <h3>Basic Details</h3>
                <div className="summary-row"><span>Name:</span> <strong>{formData.hostelName || 'N/A'}</strong></div>
                <div className="summary-row"><span>Type:</span> <strong>{formData.hostelType}</strong></div>
                <div className="summary-row"><span>Admin:</span> <strong>{formData.adminEmail}</strong></div>
              </div>
              <div className="summary-section">
                <h3>Infrastructure</h3>
                <div className="summary-row"><span>Buildings:</span> <strong>{formData.buildings.length}</strong></div>
                <div className="summary-row"><span>Total Active Rooms:</span> <strong>{formData.generatedRooms.filter(r => r.active).length}</strong></div>
              </div>
              <div className="summary-section">
                <h3>Facilities</h3>
                <div className="summary-row"><span>Mess Facility:</span> <strong>{formData.messAvailable ? 'Available' : 'Not Available'}</strong></div>
              </div>
            </div>
            <div className="final-action">
              <button className="btn-primary large" onClick={completeSetup}>
                <Icons.Check /> Complete Hostel Setup
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    { id: 1, label: 'Basic Info', icon: Icons.Home },
    { id: 2, label: 'Admin Auth', icon: Icons.User },
    { id: 3, label: 'Buildings', icon: Icons.Building },
    { id: 4, label: 'Room Matrix', icon: Icons.Grid },
    { id: 5, label: 'Mess', icon: Icons.Utensils },
    { id: 6, label: 'Review', icon: Icons.Check },
  ];
  const navigate = useNavigate();

  if (isCompleted) {
    return (
      <div className="setup-success-screen fade-in">
        <style>{css}</style>
        <div className="success-card">
          <div className="success-icon"><Icons.Check /></div>
          <h1>Setup Complete!</h1>
          <p>Your hostel management system is now ready to use.</p>
          <button
            className="btn-primary"
            onClick={() => navigate("/")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Injecting CSS Styles directly for preview availability */}
      <style>{css}</style>

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-placeholder">H</div>
          <span className="brand-name">HostelSetup</span>
        </div>

        <nav className="steps-nav">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`step-item ${activeStep === step.id ? 'active' : ''} ${activeStep > step.id ? 'completed' : ''}`}
            // Sidebar navigation disabled
            >
              <div className="step-indicator">
                {activeStep > step.id ? <Icons.Check /> : <step.icon />}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>© 2024 HostelOS</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-header">
          <h1 className="header-title">System Configuration</h1>
          <div className="header-actions">
            <span className="admin-badge">
              <span className="status-dot"></span> Admin Mode
            </span>
            <button className="icon-btn"><Icons.Bell /></button>
            <div className="avatar">A</div>
          </div>
        </header>

        <div className="content-area">
          {renderStepContent()}
        </div>

        <footer className="action-footer">
          <button
            className="btn-secondary"
            onClick={prevStep}
            disabled={activeStep === 1}
          >
            <Icons.ChevronLeft /> Back
          </button>

          <div className="footer-center">
            {validationError && (
              <div className="red-alert">
                {validationError}
              </div>
            )}
            <div className="step-counter">
              Step {activeStep} of {totalSteps}
            </div>
          </div>

          {activeStep < totalSteps && (
            <div className="next-button-container">
              <button className="btn-primary next-button" onClick={nextStep}>
                Next Step <Icons.ChevronRight />
              </button>
            </div>
          )}
        </footer>
      </main>
    </div>
  );
};

// --- Embedded CSS ---
const css = `
:root {
  --primary: #4F46E5;
  --primary-hover: #4338ca;
  --secondary: #64748B;
  --secondary-bg: #F1F5F9;
  --bg-app: #F8FAFC;
  --surface: #FFFFFF;
  --text-main: #1E293B;
  --text-light: #64748B;
  --border: #E2E8F0;
  --success: #10B981;
  --danger: #EF4444;
  --radius: 8px;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-family);
  background: var(--bg-app);
  color: var(--text-main);
  height: 100vh;
  overflow: hidden;
}

.dashboard-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
}

.logo-placeholder {
  width: 32px;
  height: 32px;
  background: var(--primary);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.brand-name {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-main);
}

.steps-nav {
  flex: 1;
  padding: 20px 12px;
  overflow-y: auto;
}

.step-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 4px;
  border-radius: var(--radius);
  cursor: default; /* Disabled pointer */
  transition: all 0.2s;
  color: var(--text-light);
}

.step-item:hover {
  background: var(--secondary-bg);
}

.step-item.active {
  background: #EEF2FF;
  color: var(--primary);
  font-weight: 600;
}

.step-item.completed {
  color: var(--success);
}

.step-indicator {
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-label {
  font-size: 0.9rem;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--border);
  font-size: 0.8rem;
  color: var(--text-light);
  text-align: center;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-header {
  height: 70px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-badge {
  background: #FEF3C7;
  color: #D97706;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #D97706;
  border-radius: 50%;
}

.icon-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--text-light);
}

.avatar {
  width: 36px;
  height: 36px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.content-area {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.action-footer {
  height: 80px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
}

.footer-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.red-alert {
  color: var(--danger);
  font-size: 0.85rem;
  font-weight: 600;
  animation: shake 0.4s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* Steps General */
.step-container {
  animation: fadeIn 0.4s ease;
}

.full-width-step {
  max-width: 1000px; /* Allow matrix to be wider */
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.step-title {
  font-size: 1.8rem;
  margin-bottom: 8px;
  color: var(--text-main);
}

.step-subtitle {
  color: var(--text-light);
  margin-bottom: 32px;
}

.step-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-actions-row {
  display: flex;
  gap: 12px;
}

/* Forms */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-grid.compact {
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #000000 !important;
  margin-bottom: 0.5rem;
  display: block;
  text-shadow: none !important;
}

input, select, textarea,
.form-input, .form-select, .form-textarea {
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  color: #000000;
}

input::placeholder,
.form-input::placeholder,
.form-textarea::placeholder {
  color: #666666;
  opacity: 1; /* Firefox */
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Buttons */
.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-primary.small {
  padding: 8px 16px;
  font-size: 0.85rem;
}

.btn-secondary {
  background: white;
  color: var(--text-main);
  border: 1px solid var(--border);
  padding: 10px 24px;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary.small {
  padding: 8px 16px;
  font-size: 0.85rem;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon-mini {
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: var(--text-light);
}

.btn-icon-mini:hover {
  background: var(--secondary-bg);
}

.btn-icon-mini.danger {
  color: var(--danger);
}

.btn-icon-mini.danger:hover {
  background: #FEF2F2;
}

.btn-icon.danger {
  color: var(--danger);
  background: #FEF2F2;
  border-radius: 4px;
  padding: 4px;
}

/* Radio Cards */
.radio-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.radio-card {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
}

.radio-card:hover {
  border-color: var(--primary);
}

.radio-card.selected {
  border-color: var(--primary);
  background: #EEF2FF;
}

.radio-circle {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-card.selected .radio-circle {
  border-color: var(--primary);
}

.radio-dot {
  width: 10px;
  height: 10px;
  background: var(--primary);
  border-radius: 50%;
}

/* Buildings */
.building-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 16px;
}

.building-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.building-badge {
  background: var(--secondary-bg);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-light);
}

.building-summary {
  margin-top: 8px;
  font-size: 0.9rem;
  color: var(--primary);
  background: #EEF2FF;
  padding: 8px 12px;
  border-radius: 6px;
  text-align: center;
}

/* Room Matrix */
.matrix-stats-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-pill {
  background: var(--secondary-bg);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  color: var(--text-light);
}

.stat-pill strong {
  color: var(--text-main);
  margin-left: 4px;
}

.room-matrix-wrapper {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  max-height: 450px;
  overflow-y: auto;
  box-shadow: var(--shadow-sm);
}

.room-matrix-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.room-matrix-table thead th {
  background: var(--secondary-bg);
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: var(--text-light);
  font-size: 0.8rem;
  text-transform: uppercase;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid var(--border);
}

.room-matrix-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #F1F5F9;
  vertical-align: middle;
}

.room-matrix-table tr:hover {
  background: #F8FAFC;
}

.row-inactive {
  background: #F8FAFC;
  opacity: 0.6;
}

.text-center {
  text-align: center;
}

.table-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 0.9rem;
}

.table-input:focus {
  border-color: var(--primary);
  outline: none;
}

.table-select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: white;
  font-size: 0.9rem;
}

.table-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--primary);
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: var(--text-light);
  font-style: italic;
}

/* Switch Mini */
.switch-mini {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
}

.switch-mini input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider-mini {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #CBD5E1;
  transition: .4s;
  border-radius: 18px;
}

.slider-mini:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider-mini {
  background-color: var(--success);
}

input:checked + .slider-mini:before {
  transform: translateX(14px);
}

/* Settings & Toggles */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}

.setting-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.setting-icon {
  background: #EEF2FF;
  color: var(--primary);
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.setting-details h4 {
  margin-bottom: 4px;
}

.setting-details p {
  font-size: 0.9rem;
  color: var(--text-light);
}

.toggle-switch {
  margin-left: auto;
  position: relative;
  width: 50px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #CBD5E1;
  transition: .4s;
  border-radius: 34px;
}

.toggle-label:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-label {
  background-color: var(--success);
}

input:checked + .toggle-label:before {
  transform: translateX(24px);
}

/* Review */
.review-summary {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.summary-section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}

.summary-section h3 {
  font-size: 1rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.summary-row:last-child {
  border-bottom: none;
}

.final-action {
  display: flex;
  justify-content: flex-end;
}

.success-card {
  max-width: 400px;
  background: white;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  box-shadow: var(--shadow-md);
  margin: 100px auto;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: #DCFCE7;
  color: var(--success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.success-card h1 {
  margin-bottom: 12px;
}

.success-card p {
  color: var(--text-light);
  margin-bottom: 24px;
}
`;

export default HostelSetupDashboard;