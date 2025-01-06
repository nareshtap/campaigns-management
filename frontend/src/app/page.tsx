import CampaignList from "./components/campaignList";
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.main}>
      <h2>Campaign Management</h2>
      <CampaignList />
    </div>
  );
}
