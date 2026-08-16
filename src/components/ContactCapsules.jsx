import { useEffect, useRef, useState } from "react";
import profile from "../data/profile";

async function copyToClipboard(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H5.29289C5.51864 2 5.71534 2.15829 5.7632 2.37918L6.55279 6.02639C6.60065 6.24728 6.49799 6.47376 6.30902 6.58541L4.94721 7.38197C5.52117 8.79267 6.70733 9.97883 8.11803 10.5528L8.91459 9.19098C9.02624 9.00201 9.25272 8.89935 9.47361 8.94721L13.1208 9.7368C13.3417 9.78466 13.5 9.98136 13.5 10.2071V12C13.5 12.2761 13.2761 12.5 13 12.5C7.75329 12.5 3 7.74671 3 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 4L7.29289 8.14645C7.68342 8.53697 8.31658 8.53697 8.70711 8.14645L14.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ContactCapsules() {
  const [copied, setCopied] = useState(null);
  const feedbackTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(feedbackTimer.current), []);

  const handleCopy = async (type, value) => {
    try {
      await copyToClipboard(value);
      setCopied(type);
      window.clearTimeout(feedbackTimer.current);
      feedbackTimer.current = window.setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  };

  return (
    <>
      <button
        type="button"
        className="hero-capsule hero-capsule--phone"
        onClick={() => handleCopy("phone", profile.phone)}
        aria-label={`复制联系电话 ${profile.phone}`}
      >
        <span className="hero-capsule-icon hero-capsule-icon--gray"><PhoneIcon /></span>
        <span className="hero-capsule-text">{copied === "phone" ? "已复制" : "联系电话"}</span>
      </button>

      <button
        type="button"
        className="hero-capsule hero-capsule--email"
        onClick={() => handleCopy("email", profile.email)}
        aria-label={`复制电子邮箱 ${profile.email}`}
      >
        <span className="hero-capsule-icon hero-capsule-icon--gray"><EmailIcon /></span>
        <span className="hero-capsule-text">{copied === "email" ? "已复制" : "电子邮箱"}</span>
      </button>
    </>
  );
}
