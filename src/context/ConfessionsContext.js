import React, { createContext, useState, useCallback } from 'react';

export const ConfessionsContext = createContext();

export const ConfessionsProvider = ({ children }) => {
  const [newConfessions, setNewConfessions] = useState([]);

  const addNewConfession = useCallback((confession) => {
    setNewConfessions(prev => [confession, ...prev]);
  }, []);

  const clearNewConfessions = useCallback(() => {
    setNewConfessions([]);
  }, []);

  
  return (
    <ConfessionsContext.Provider value={{ newConfessions, addNewConfession, clearNewConfessions}}>
      {children}
    </ConfessionsContext.Provider>
  );
};