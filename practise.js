// practice.js

// Sample slot object
const slot = {
  startTime: "2024-07-08T05:00:00.000+00:00"
};

// Convert the startTime to a formatted local time string
const startTime = new Date(slot.startTime).toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
});

console.log(startTime);