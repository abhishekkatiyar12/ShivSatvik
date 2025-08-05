exports.bookingConfirmationTemplate = (name, flat, checkIn, checkOut, amount) => `
  <h2>Booking Confirmed!</h2>
  <p>Hello ${name},</p>
  <p>Your booking at ShivSatvik Homestay is confirmed.</p>
  <ul>
    <li>Flat: ${flat}</li>
    <li>Check-in: ${checkIn}</li>
    <li>Check-out: ${checkOut}</li>
    <li>Amount Paid: ₹${amount}</li>
  </ul>
  <p>Thank you for booking with us!</p>
`;

exports.refundTemplate = (name, amount) => `
  <h2>Refund Processed</h2>
  <p>Hello ${name},</p>
  <p>Your refund of ₹${amount} has been successfully processed.</p>
  <p>If you have any queries, contact us at support@shivsatvik.com</p>
`;
