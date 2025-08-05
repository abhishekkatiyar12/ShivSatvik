import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import styles from "./FlatDetails.module.css";

export default function FlatDetails() {
  const { id } = useParams();
  const [flat, setFlat] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFlat();
  }, []);

  const fetchFlat = async () => {
    try {
      const { data } = await axiosInstance.get(`/flats/${id}`);
      setFlat(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.");
      return;
    }
    setLoading(true);
    try {
      // Step 1: Create booking on backend
      const bookingRes = await axiosInstance.post("/bookings", {
        flatId: flat._id,
        checkIn,
        checkOut,
        guests,
        amount: flat.pricePerNight,
      });

      const bookingId = bookingRes.data.booking._id;

      // Step 2: Create Razorpay order
      const orderRes = await axiosInstance.post("/payments/create-order", {
        amount: flat.pricePerNight,
        bookingId,
      });

      const { order } = orderRes.data;

      // Step 3: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ShivSatvik Homestay",
        description: `Booking for ${flat.type}`,
        order_id: order.id,
        handler: async function (response) {
          await axiosInstance.post("/payments/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId,
          });
          alert("Payment successful! Your booking is confirmed.");
        },
        prefill: {
          name: "Guest",
          email: "guest@example.com",
          contact: "9876543210",
        },
        theme: { color: "#ff5a5f" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Error creating booking");
    } finally {
      setLoading(false);
    }
  };

  if (!flat) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      {/* Flat Image */}
      <img src={flat.images[0]} alt={flat.type} className={styles.image} />

      {/* Flat Details */}
      <div className={styles.details}>
        <h2>{flat.type}</h2>
        <p>{flat.description}</p>
        <p><strong>Location:</strong> {flat.location}</p>
        <p className={styles.price}>₹{flat.pricePerNight} / night</p>
      </div>

      {/* Booking Section */}
      <div className={styles.bookingSection}>
        <div className={styles.dateInputs}>
          <label>Check-in Date:</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
          <label>Check-out Date:</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <div className={styles.guests}>
          <label>Guests:</label>
          <input
            type="number"
            value={guests}
            min="1"
            onChange={(e) => setGuests(e.target.value)}
          />
        </div>

        <button
          className={styles.bookBtn}
          onClick={handleBooking}
          disabled={loading}
        >
          {loading ? "Processing..." : "Book Now"}
        </button>
      </div>
    </div>
  );
}
