/**
 * Formats a timestamp into a relative time string (e.g., "5m ago", "2h ago", "3d ago").
 * Pure native JavaScript implementation — no external dependencies.
 */
export function formatTimeAgo(dateString) {
if (!dateString) return '';

const date = new Date(dateString);
if (isNaN(date.getTime())) return '';

const now = new Date();
const diffMs = now - date;
const diffSec = Math.floor(diffMs / 1000);
const diffMin = Math.floor(diffSec / 60);
const diffHour = Math.floor(diffMin / 60);
const diffDay = Math.floor(diffHour / 24);
const diffMonth = Math.floor(diffDay / 30);
const diffYear = Math.floor(diffDay / 365);

if (diffSec < 60) return 'just now';
if (diffMin < 60) return `${diffMin}m ago`;
if (diffHour < 24) return `${diffHour}h ago`;
if (diffDay < 30) return `${diffDay}d ago`;
if (diffMonth < 12) return `${diffMonth}mo ago`;
return `${diffYear}y ago`;
}

/**
 * Formats a timestamp into a full date string for profiles or tooltips (e.g., "Sep 1, 2026").
 * Supports tokens: MMM, MMMM, d, dd, yyyy, yy, HH, hh, mm, ss, a.

* @param {string} dateString - ISO date string
* @param {string} formatStr - Format template (default: 'MMM d, yyyy')
*/
export function formatDate(dateString, formatStr = 'MMM d, yyyy') {
if (!dateString) return '';

const date = new Date(dateString);
if (isNaN(date.getTime())) return '';

const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthsLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pad = (n) => String(n).padStart(2, '0');

const tokens = {
MMM: monthsShort[date.getMonth()],
MMMM: monthsLong[date.getMonth()],
d: String(date.getDate()),
dd: pad(date.getDate()),
yyyy: String(date.getFullYear()),
yy: String(date.getFullYear()).slice(-2),
HH: pad(date.getHours()),
hh: pad(date.getHours() % 12 || 12),
mm: pad(date.getMinutes()),
ss: pad(date.getSeconds()),
a: date.getHours() >= 12 ? 'PM' : 'AM',
};

return formatStr.replace(/MMMM|MMM|dd|d|yyyy|yy|HH|hh|mm|ss|a/g, (match) => tokens[match] ?? match);
}