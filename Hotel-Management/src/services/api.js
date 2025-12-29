import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

/* ================= AXIOS INSTANCE ================= */
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================= ROOM APIs ================= */
export const getRoomStats = async () => {
  const res = await api.get("/rooms/stats");
  return res.data;
};

/* ================= STUDENT APIs ================= */
export const registerStudent = async (studentData) => {
  const res = await api.post("/students/register", studentData);
  return res.data;
};

export const getAllStudents = async () => {
  const res = await api.get("/students");
  return res.data;
};

export const getStudentById = async (id) => {
  const res = await api.get(`/students/${id}`);
  return res.data;
};

/* ================= PANEL APIs ================= */

// Notifications
export const getNotifications = async () => {
  const res = await api.get("/panel/notifications");
  return res.data;
};

// Complaints (Student)
export const createComplaint = async (payload) => {
  const res = await api.post("/panel/complaints", payload);
  return res.data;
};

export const getComplaints = async () => {
  const res = await api.get("/panel/complaints");
  return res.data;
};

export const updateComplaintStatus = async (complaintId, status) => {
  const res = await api.put(`/panel/complaints/${complaintId}/status`, { status });
  return res.data;
};

// Complaints (Admin)
export const getComplaintsForAdmin = async (hostelId) => {
  const hostelIdStr = hostelId?._id || hostelId?.toString() || hostelId;
  const res = await api.get(
    `/panel/complaints/admin?hostelId=${hostelIdStr}`
  );
  return res.data;
};

// Anti-ragging (Student)
export const createAntiRagging = async (payload) => {
  const res = await api.post("/panel/antiragging", payload);
  return res.data;
};

export const getAntiRagging = async () => {
  const res = await api.get("/panel/antiragging");
  return res.data;
};

export const updateAntiRaggingStatus = async (reportId, status) => {
  const res = await api.put(`/panel/antiragging/${reportId}/status`, { status });
  return res.data;
};

// Anti-ragging (Admin)
export const getAntiRaggingForAdmin = async (hostelId) => {
  const hostelIdStr = hostelId?._id || hostelId?.toString() || hostelId;
  const res = await api.get(
    `/panel/antiragging/admin?hostelId=${hostelIdStr}`
  );
  return res.data;
};

// Mess
export const getMessMenu = async () => {
  const res = await api.get("/panel/mess");
  return res.data;
};

// Departure
export const createDeparture = async (payload) => {
  const res = await api.post("/panel/departure", payload);
  return res.data;
};

export const getDepartures = async () => {
  const res = await api.get("/panel/departure");
  return res.data;
};

export const getDeparturesForAdmin = async (hostelId) => {
  const hostelIdStr = hostelId?._id || hostelId?.toString() || hostelId;
  const res = await api.get(`/panel/departure/admin?hostelId=${hostelIdStr}`);
  return res.data;
};

export const updateDepartureStatus = async (departureId, status) => {
  const res = await api.put(`/panel/departure/${departureId}/status`, { status });
  return res.data;
};

// Fees
export const getFees = async () => {
  const res = await api.get("/panel/fees");
  return res.data;
};

// Feedback
export const postFeedback = async (payload) => {
  const res = await api.post("/panel/feedback", payload);
  return res.data;
};

export const getFeedback = async () => {
  const res = await api.get("/panel/feedback");
  return res.data;
};

/* ================= CHAT APIs (NEW SYSTEM) ================= */

// PERSONAL CHAT (student ↔ admin)
export const sendPersonalMessage = async (receiverId, text) => {
  const res = await api.post("/chat/personal", { receiverId, text });
  return res.data;
};

export const getPersonalMessages = async (receiverId) => {
  const res = await api.get(`/chat/personal/${receiverId}`);
  return res.data;
};

// GROUP CHAT
export const sendGroupMessage = async (text) => {
  const res = await api.post("/chat/group/send", { text });
  return res.data;
};

export const getGroupMessages = async () => {
  const res = await api.get("/chat/group");
  return res.data;
};

/* ================= ADMIN APIs ================= */
export const getAdminByEmail = async (email) => {
  const res = await api.get(`/admins/${encodeURIComponent(email)}`);
  return res.data;
};

export const createAdmin = async (adminData) => {
  const res = await api.post("/admins/create", adminData);
  return res.data;
};

/* ================= ROOM ALLOTMENT APIs ================= */
export const getAllRooms = async () => {
  const res = await api.get("/admin/rooms");
  return res.data;
};

export const getAvailableRooms = async (type) => {
  const res = await api.get(
    `/admin/available-rooms${type ? `?type=${encodeURIComponent(type)}` : ""}`
  );
  return res.data;
};

export const autoAllot = async () => {
  const res = await api.post("/admin/auto-allot");
  return res.data;
};

export const manualAllot = async (studentId, roomNumber) => {
  const res = await api.post("/admin/manual-allot", { studentId, roomNumber });
  return res.data;
};

export const removeAllotment = async (studentId) => {
  const res = await api.post("/admin/remove-allotment", { studentId });
  return res.data;
};

// ================= HOSTEL SETUP APIs =================
export const saveHostelDraft = async (step, data, hostelId) => {
  const res = await api.post("/hostel-setup/save-draft", { step, data, hostelId });
  return res.data;
};

export const completeHostelSetup = async (hostelId) => {
  const res = await api.post("/hostel-setup/complete", { hostelId });
  return res.data;
};

export const createSuperAdmin = async (adminData) => {
  const res = await api.post("/admins/create-super-admin", adminData);
  return res.data;
};

// ================= CHAT (STUDENT) =================
export const getAdminsForChat = async () => {
  const res = await api.get("/chat/admins");
  return res.data;
};