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
        <span>
          Created by <span className={styles.footer__signature}>zgfpeter</span>
        </span>
      </p>
    </footer>
  );
}
