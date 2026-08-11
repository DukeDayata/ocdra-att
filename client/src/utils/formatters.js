/**
 * Formats date into standard "Month Day, Year" format.
 */
export const formatDate = (dateValue) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return String(dateValue);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formats date into short "YYYY-MM-DD" or "MM/DD/YYYY"
 */
export const formatDateShort = (dateValue) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return String(dateValue);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Automatically formats start and end dates into periodOfTravel string
 */
export const formatPeriodOfTravel = (startDateStr, endDateStr) => {
  if (!startDateStr && !endDateStr) return '';
  if (startDateStr && !endDateStr) return formatDate(startDateStr);
  if (!startDateStr && endDateStr) return formatDate(endDateStr);

  const startFormatted = formatDate(startDateStr);
  const endFormatted = formatDate(endDateStr);

  if (startFormatted === endFormatted) return startFormatted;
  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Formats numerical values to Philippine Currency string (₱ 1,234.56 or 0.00)
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || amount === '') return '0.00';
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return String(amount);
  return new Intl.NumberFormat('en-PH', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

/**
 * Converts multiline purpose text into bullet point formatted HTML/string
 */
export const toBullets = (text) => {
  if (!text) return '';
  return text
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => `• ${line.trim()}`)
    .join('\n');
};
