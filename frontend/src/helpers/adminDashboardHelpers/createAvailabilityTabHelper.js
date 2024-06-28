import { useState, useCallback } from "react";



// Helper function for fetching data
export const fetchData = async (url, errorMessage) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(errorMessage);
  return await response.json();
};

// Helper function for updating data
export const updateData = async (url, data, errorMessage) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(errorMessage);
  return await response.json();
};

// Helper function for creating data
export const createData = async (url, data, errorMessage) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(errorMessage);
  return await response.json();
};
