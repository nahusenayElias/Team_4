import mautic from "mautic-tracking";

// Replace with your Mautic instance's localhost address. Omit trailing forward slash.
const mauticUrl = "http://localhost:55793";

// Initialize the Mautic Tracking
mautic.initialize(`${mauticUrl}/mtc.js`);

export default mautic;
