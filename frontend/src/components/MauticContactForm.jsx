import { useEffect, useState } from "react";
import "../css/MauticForm.css";

const MauticContactForm = () => {
  const mauticUrl = import.meta.env.VITE_MAUTIC_BASE_URL;
  const [formHtml, setFormHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMauticScript = () => {
      return new Promise((resolve, reject) => {
        if (typeof window.MauticSDKLoaded !== "undefined") {
          resolve();
          return;
        }

        window.MauticSDKLoaded = true;
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `${mauticUrl}/media/js/mautic-form.js?v352fe31c`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
      });
    };

    const modifyFormHtml = (html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Move message div to bottom of form
      const messageDiv = doc.getElementById(
        "mauticform_mauticcontactform_message"
      );
      const errorDiv = doc.getElementById("mauticform_mauticcontactform_error");

      if (messageDiv) {
        messageDiv.remove();
        messageDiv.style.display = "none"; // Hide message div by default
      }
      if (errorDiv) {
        errorDiv.remove();
        errorDiv.style.display = "none"; // Hide error div by default
      }

      // Create a new container for messages at the bottom
      const messagesContainer = doc.createElement("div");
      messagesContainer.className = "mauticform-messages-container";
      messagesContainer.style.cssText = "margin-top: 20px; text-align: center;";

      if (errorDiv) {
        messagesContainer.appendChild(errorDiv);
      }
      if (messageDiv) {
        messageDiv.style.cssText =
          "padding: 15px; background-color: #dff0d8; color: #3c763d; border-radius: 4px; margin-top: 10px; display: none;";
        messagesContainer.appendChild(messageDiv);
      }

      // Add the messages container after the submit button
      const submitWrapper = doc.getElementById(
        "mauticform_mauticcontactform_submit"
      );
      if (submitWrapper) {
        submitWrapper.parentNode.insertBefore(
          messagesContainer,
          submitWrapper.nextSibling
        );
      }

      return doc.documentElement.innerHTML;
    };

    const handleFormSubmit = (event) => {
      event.preventDefault(); // Prevent default form submission

      const form = event.target;
      if (!form.matches("#mauticform_mauticcontactform")) return;

      const formName = form.querySelector(
        "#mauticform_mauticcontactform_name"
      ).value;

      if (typeof window.MauticFormCallback !== "function") {
        window.MauticFormCallback = {
          [formName]: {
            onResponse: function (response) {
              const errorDiv = document.getElementById(
                "mauticform_mauticcontactform_error"
              );
              const messageDiv = document.getElementById(
                "mauticform_mauticcontactform_message"
              );

              if (response.success) {
                if (messageDiv) {
                  messageDiv.innerHTML =
                    response.message || "Thank you for your submission!";
                  messageDiv.style.display = "block";
                }
                if (errorDiv) errorDiv.style.display = "none";
                form.reset();
              } else {
                if (response.errors) {
                  Object.entries(response.errors).forEach(
                    ([field, message]) => {
                      const fieldDiv = document.getElementById(
                        `mauticform_mauticcontactform_${field}`
                      );
                      if (fieldDiv) {
                        const errorMsg = fieldDiv.querySelector(
                          ".mauticform-errormsg"
                        );
                        if (errorMsg) {
                          errorMsg.textContent = message;
                          errorMsg.style.display = "block";
                        }
                      }
                    }
                  );
                }

                if (errorDiv && response.message) {
                  errorDiv.innerHTML = response.message;
                  errorDiv.style.display = "block";
                }
                if (messageDiv) messageDiv.style.display = "none";
              }

              // Smooth scroll to message
              const messagesContainer = document.querySelector(
                ".mauticform-messages-container"
              );
              if (messagesContainer) {
                messagesContainer.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
            },
          },
        };
      }
    };

    const initializeMautic = async () => {
      try {
        const response = await fetch("/mautic-contact-form.html");
        const data = await response.text();

        // Replace localhost URLs and modify HTML structure
        const updatedHtml = modifyFormHtml(
          data.replace(/http:\/\/localhost:\d+/g, mauticUrl)
        );

        setFormHtml(updatedHtml);

        await loadMauticScript();

        window.MauticDomain = mauticUrl;
        window.MauticLang = { submittingMessage: "Please wait..." };

        if (window.MauticSDK) {
          window.MauticSDK.onLoad();
        }

        setTimeout(() => {
          document.addEventListener("submit", handleFormSubmit);
        }, 100);
      } catch (err) {
        console.error("Mautic form initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMautic();

    return () => {
      document.removeEventListener("submit", handleFormSubmit);
      const scriptTag = document.querySelector(
        `script[src="${mauticUrl}/media/js/mautic-form.js"]`
      );
      if (scriptTag) scriptTag.remove();
    };
  }, [mauticUrl]);

  if (isLoading) {
    return <div>Loading form...</div>;
  }

  return (
    <div
      className="mauticform-container"
      dangerouslySetInnerHTML={{ __html: formHtml }}
    />
  );
};

export default MauticContactForm;
