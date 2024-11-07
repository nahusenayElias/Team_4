import SectionHeading from "../components/SectionHeading";

const MauticContactForm = () => {
  let url = import.meta.env.VITE_MAUTIC_BASE_URL;
  let updatedUrl = url.replace(/^https?:/, "");

  return (
    <div>
      <SectionHeading>Contact Form</SectionHeading>
      <iframe src={`${updatedUrl}/form/1`} width="100%" height="600">
        <p>Your browser does not support iframes.</p>
      </iframe>
    </div>
  );
};

export default MauticContactForm;
