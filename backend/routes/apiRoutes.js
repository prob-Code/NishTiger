const express = require("express");
const { cameras, tigers, alerts, movements } = require("../data");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "ONLINE",
    system: "TigerTrace IoT Wildlife Intelligence System"
  });
});

router.get("/stats", (req, res) => {
  const online = cameras.filter(c => c.status === "online").length;
  const warning = cameras.filter(c => c.status === "warning").length;
  const offline = cameras.filter(c => c.status === "offline").length;

  res.json({
    success: true,
    stats: {
      tigersMonitored: tigers.length,
      cameraStations: cameras.length,
      online,
      warning,
      offline,
      imagesProcessed: 24680,
      activeAlerts: alerts.length
    }
  });
});

router.get("/cameras", (req, res) => {
  res.json({ success: true, cameras });
});

router.get("/tigers", (req, res) => {
  res.json({ success: true, tigers });
});

router.get("/alerts", (req, res) => {
  res.json({ success: true, alerts });
});

router.get("/movements", (req, res) => {
  res.json({ success: true, movements });
});

module.exports = router;