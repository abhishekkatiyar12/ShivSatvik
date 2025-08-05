import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axiosInstance.get("/bookings/my-bookings");
      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await axiosInstance.put(`/bookings/cancel/${id}`);
        alert("Booking cancelled successfully");
        fetchBookings();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        <div className={styles.bookingList}>
          {bookings.map((booking) => (
            <div key={booking._id} className={styles.bookingCard}>
              <h4>{booking.flat.type}</h4>
              <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
              <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
              <p>Status: {booking.status}</p>
              <p>Amount: ₹{booking.amount}</p>
              {booking.status !== "cancelled" && (
                <button
                  className={styles.cancelBtn}
                  onClick={() => cancelBooking(booking._id)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
