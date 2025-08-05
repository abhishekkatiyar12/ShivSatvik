import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  const [flats, setFlats] = useState([]);

  useEffect(() => {
    axios.get("/flats").then(res => setFlats(res.data));
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Available Flats</h2>
      <div className={styles.grid}>
        {flats.map(flat => (
          <div className={styles.card} key={flat._id}>
            <img src={flat.images[0]} className={styles.image} alt="flat" />
            <div className={styles.cardBody}>
              <h5>{flat.type}</h5>
              <p>{flat.location}</p>
              <p className={styles.price}>₹{flat.pricePerNight} / night</p>
              <Link to={`/flat/${flat._id}`} className={styles.btn}>View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
