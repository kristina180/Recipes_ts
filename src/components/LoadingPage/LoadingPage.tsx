import { Loader } from "lucide-react";
import styles from "./LoadingPage.module.scss";

export default function LoadingPage() {
  return (
    <div className={styles.load}>
      <p> Loading &nbsp; </p>
      <Loader size={28} />
    </div>
  );
}
