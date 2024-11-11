import { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import "../css/MauticForm.css";

const MauticContactForm = () => {
  const mauticUrl = import.meta.env.VITE_MAUTIC_BASE_URL;
  const [formHtml, setFormHtml] = useState("");

  useEffect(() => {
    // Dynamically fetch the HTML form from the public directory
    fetch("/mautic-contact-form.html")
      .then((response) => response.text())
      .then((data) => {
        // Replace the localhost URL with the value from the env file
        const updatedHtml = data.replace(/http:\/\/localhost:\d+/g, mauticUrl);
        setFormHtml(updatedHtml);
      })
      .catch((error) => console.error("Error loading form HTML:", error));

    // Only add script once if MauticSDKLoaded is not already true
    if (typeof window.MauticSDKLoaded === "undefined") {
      window.MauticSDKLoaded = true;
      const head = document.getElementsByTagName("head")[0];
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `${mauticUrl}/media/js/mautic-form.js?v352fe31c`; // Use dynamic base URL
      script.async = true;
      script.onload = () => {
        if (window.MauticSDK) {
          window.MauticSDK.onLoad();
        }
      };
      head.appendChild(script);

      // Set global Mautic variables
      window.MauticDomain = mauticUrl;
      window.MauticLang = { submittingMessage: "Please wait..." };
    } else if (typeof window.MauticSDK !== "undefined") {
      window.MauticSDK.onLoad();
    }
  }, [mauticUrl]);

  return (
    <>
      <SectionHeading>Contact Form</SectionHeading>
      <div
        className="mauticform-container"
        dangerouslySetInnerHTML={{ __html: formHtml }}
      />
    </>
  );
};

export default MauticContactForm;
