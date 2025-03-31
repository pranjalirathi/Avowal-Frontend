import React, { createContext, useState, useCallback } from 'react';

export const ConfessionsContext = createContext();

export const ConfessionsProvider = ({ children }) => {
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now());
  
  const triggerRefresh = useCallback(() => {
    setRefreshTimestamp(Date.now()); 
  }, []);
  
  return (
    <ConfessionsContext.Provider value={{ refreshTimestamp, triggerRefresh }}>
      {children}
    </ConfessionsContext.Provider>
  );
};