import profile from "../data/profile";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>&copy; {new Date().getFullYear()} {profile.nameEn}. All Rights Reserved.</p>
        <p>Designed and developed by {profile.nameEn}.</p>
      </div>
    </footer>
  );
}
