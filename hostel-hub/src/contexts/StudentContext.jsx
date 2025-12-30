import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getStudentById } from '../services/api';

const StudentContext = createContext(null);

export const useStudent = () => useContext(StudentContext);

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFromLocal = () => {
    try {
      const raw = localStorage.getItem('studentData');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  };

  const fetchFresh = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getStudentById(id);
      if (res && res.success) {
        setStudent(res.data);
        localStorage.setItem('studentData', JSON.stringify(res.data));
      } else {
        setStudent(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load student');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const local = loadFromLocal();
    if (local) {
      setStudent(local);
      setLoading(false);
      // refresh in background
      fetchFresh(local._id || local.id);
    } else {
      setLoading(false);
    }
  }, [fetchFresh]);

  const refresh = useCallback(() => {
    const local = loadFromLocal();
    if (local && (local._id || local.id)) fetchFresh(local._id || local.id);
  }, [fetchFresh]);

  return (
    <StudentContext.Provider value={{ student, loading, error, refresh }}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentContext;
