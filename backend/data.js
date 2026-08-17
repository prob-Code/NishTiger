const cameras = [
  { id: "PTR-C01", zone: "Turia", status: "online", battery: 87, signal: 92, temperature: 27, lastSync: "2 min ago", captures: 421 },
  { id: "PTR-C02", zone: "Karmajhiri", status: "online", battery: 74, signal: 88, temperature: 29, lastSync: "4 min ago", captures: 338 },
  { id: "PTR-C03", zone: "Sitaghat", status: "warning", battery: 23, signal: 71, temperature: 31, lastSync: "18 min ago", captures: 290 },
  { id: "PTR-C04", zone: "Buffer North", status: "offline", battery: 8, signal: 0, temperature: 0, lastSync: "2 hr ago", captures: 182 },
  { id: "PTR-C05", zone: "Teliya", status: "online", battery: 91, signal: 95, temperature: 26, lastSync: "1 min ago", captures: 501 },
  { id: "PTR-C06", zone: "Khoka", status: "online", battery: 66, signal: 83, temperature: 28, lastSync: "6 min ago", captures: 367 }
];

const tigers = [
  { id: "T-07", sex: "Male", age: "Adult", lastSeen: "PTR-C03", confidence: 94, status: "Active" },
  { id: "T-12", sex: "Female", age: "Adult", lastSeen: "PTR-C05", confidence: 91, status: "Active" },
  { id: "T-18", sex: "Male", age: "Sub-adult", lastSeen: "PTR-C01", confidence: 89, status: "Active" },
  { id: "T-21", sex: "Female", age: "Adult", lastSeen: "PTR-C06", confidence: 86, status: "Active" },
  { id: "T-25", sex: "Male", age: "Adult", lastSeen: "PTR-C02", confidence: 82, status: "Active" }
];

const alerts = [
  { id: "A-001", level: "critical", title: "T-07 range shift", detail: "Detection outside historical movement range", time: "8 min ago" },
  { id: "A-002", level: "high", title: "T-12 buffer movement", detail: "Detected near buffer station", time: "31 min ago" },
  { id: "A-003", level: "warning", title: "PTR-C03 battery", detail: "Battery below 25%", time: "1 hr ago" },
  { id: "A-004", level: "critical", title: "PTR-C04 offline", detail: "Camera disconnected", time: "2 hr ago" }
];

const movements = [
  { tiger: "T-07", camera: "PTR-C01", zone: "Turia", lat: 21.55, lng: 79.25, time: "08:15" },
  { tiger: "T-07", camera: "PTR-C03", zone: "Sitaghat", lat: 21.57, lng: 79.28, time: "12:42" },
  { tiger: "T-07", camera: "PTR-C05", zone: "Teliya", lat: 21.60, lng: 79.31, time: "14:10" },
  { tiger: "T-12", camera: "PTR-C02", zone: "Karmajhiri", lat: 21.52, lng: 79.29, time: "10:20" },
  { tiger: "T-18", camera: "PTR-C06", zone: "Khoka", lat: 21.59, lng: 79.23, time: "13:05" }
];

module.exports = { cameras, tigers, alerts, movements };