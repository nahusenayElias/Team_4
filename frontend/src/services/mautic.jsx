import mautic from "mautic-tracking";

const mauticUrl = import.meta.env.VITE_MAUTIC_BASE_URL;

// Initialize the Mautic Tracking
mautic.initialize(`${mauticUrl}/mtc.js`);

export default mautic;
