import { useEffect, useState, useRef } from "react";
import "../css/MauticForm.css";
import { drupalLocalhostAddress } from "../services/api";

const MauticContactForm = () => {
  const mauticUrl = import.meta.env.VITE_MAUTIC_BASE_URL;
  const [formId, setFormId] = useState(null);
  const formContainerRef = useRef(null);

  useEffect(() => {
    const fetchFormId = async () => {
      const formResponse = await fetch(
        `${drupalLocalhostAddress}/jsonapi/block_content/mautic_block`
      );
      const formData = await formResponse.json();
      if (!formResponse.ok) {
        throw new Error("Failed to fetch Mautic form data");
      }
      const mauticFormId =
        formData.data[0]?.attributes?.field_mautic_block_formid;
      // console.log("Mautic Form ID:", mauticFormId);
      setFormId(mauticFormId);
    };

    fetchFormId();
  }, []);

  useEffect(() => {
    if (formContainerRef.current === null) {
      console.error(
        "formContainerRef is null. Cannot load Mautic form script."
      );
      return;
    }
    if (formId && formContainerRef.current) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `${mauticUrl}/form/generate.js?id=${formId}`;
      script.async = true;
      script.onload = () => {
        // console.log("Mautic form script loaded successfully.");
        const formElement = formContainerRef.current.querySelector("form");
        if (formElement) {
          formElement.action = `${mauticUrl}/form/submit?formId=${formId}`;
        }
      };
      script.onerror = () => {
        console.error("Error loading Mautic form script.");
      };
      formContainerRef.current.appendChild(script);

      return () => {
        if (formContainerRef.current)
          formContainerRef.current.removeChild(script);
      };
    }
  }, [formId]);

  return (
    <div className="mautic-form-container mb-2" ref={formContainerRef}></div>
  );
};

export default MauticContactForm;
