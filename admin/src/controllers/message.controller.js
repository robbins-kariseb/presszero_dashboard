export const calculateTime = (time, del=null) => {
    const currentTime = new Date();
    const messageTime = new Date(time);

    // Calculate the time difference in milliseconds
    const timeDifference = currentTime - messageTime;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "less than a minute ago";
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days === 1) {
      return "yesterday";
    } else if (days <= 2) {
      return "today";
    } else {
      return time.split(del ? del : " ")[0]; // Return the date if older than two days
    }
};