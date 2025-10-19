import "@/styles/footer.scss";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <a
        href="https://github.com/zgfpeter/itinerary-planner"
        target="_blank"
        rel="noopener noreferrer"
        className="footer__link"
      >
        View on GitHub <FaGithub className="footer__icon" />
      </a>

      <p className="footer__copyright">
        <span>© 2025 zgfpeter.</span> All rights reserved.
      </p>
    </footer>
  );
}
