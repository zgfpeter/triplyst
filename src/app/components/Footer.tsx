import styles from "@/styles/footer.module.scss";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        href="https://github.com/zgfpeter/itinerary-planner"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.footer__link}
      >
        View on GitHub <FaGithub className={styles.footer__icon} />
      </a>

      <p className={styles.footer__copyright}>
        <span>© 2025 zgfpeter.</span> All rights reserved.
      </p>
    </footer>
  );
}
