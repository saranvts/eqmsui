const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return "";

  const isoString = dateString.replace(' ', 'T');
  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Numeric month
  const year = date.getFullYear();

  if (!includeTime) {
    return `${day}-${month}-${year}`;
  }

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;
  const formattedHours = String(hours).padStart(2, '0');

  return `${day}-${month}-${year}, ${formattedHours}:${minutes} ${ampm}`;
};

export default formatDate;
