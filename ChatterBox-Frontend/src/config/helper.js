export function getWhatsAppTimestamp(date) {
    const now = new Date();
    const messageDate = new Date(date);

    const isToday = now.toDateString() === messageDate.toDateString();
    const isYesterday = 
        new Date(now.setDate(now.getDate() - 1)).toDateString() === messageDate.toDateString();

    if (isToday) {
        return getFormattedTime(messageDate); // Only time for today's messages
    } else if (isYesterday) {
        return `Yesterday ${getFormattedTime(messageDate)}`; // "Yesterday HH:MM AM/PM"
    } else {
        return `${getFormattedDate(messageDate)} ${getFormattedTime(messageDate)}`; // "12 Mar 2024 10:30 AM"
    }
}

// Helper function to format time (WhatsApp style: HH:MM AM/PM)
const getFormattedTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    const formattedHours = hours % 12 || 12; // Convert 24-hour format to 12-hour
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

// Helper function to format date (WhatsApp style: "12 Mar 2024")
const getFormattedDate = (date) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
};

console.log(getWhatsAppTimestamp(new Date())); 
// Output: "10:15 AM" (For today's messages)

console.log(getWhatsAppTimestamp(new Date(Date.now() - 86400000))); 
// Output: "Yesterday 9:30 PM" (For yesterday's messages)

console.log(getWhatsAppTimestamp("2023-12-01T14:00:00Z")); 
// Output: "01 Dec 2023 2:00 PM" (For older messages)
