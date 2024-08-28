export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};