import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import styles from "./Booking.module.css";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flat, setFlat] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

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

  const handlePayment = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    const days =
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 3600 * 24);

    const amount = flat.pricePerNight * days;

    try {
      const bookingRes = await axiosInstance.post("/bookings", {
        flatId: id,
        checkIn,
        checkOut,
        guests,
        amount,
      });

      const { data: orderRes } = await axiosInstance.post("/payments/create-order", {
        amount,
        bookingId: bookingRes.data._id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "ShivSatvik Homestay",
        description: "Booking Payment",
        order_id: orderRes.order.id,
        handler: async (response) => {
          await axiosInstance.post("/payments/verify-payment", {
            ...response,
            bookingId: bookingRes.data._id,
          });
          alert("Payment successful! Booking confirmed.");
          navigate("/dashboard");
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: { color: "#ff5a5f" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
    }
  };

  if (!flat) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2>Booking for {flat.type}</h2>
      <div className={styles.form}>
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
        <input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} />
        <button onClick={handlePayment} className={styles.payBtn}>Proceed to Pay</button>
      </div>
    </div>
  );
}
