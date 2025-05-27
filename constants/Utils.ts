export const formatViews = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return `${num.toString()} views`;
};

export const timeAgo = (timestamp: number | string) => {
  if (typeof timestamp === "string") {
    const cleaned = timestamp.replace(/\.\d+/, "");
    const date = new Date(cleaned);
    if (isNaN(date.getTime())) return "now";
    timestamp = date.getTime();
  }

  if (typeof timestamp === "number" && timestamp.toString().length === 10) {
    timestamp = timestamp * 1000;
  }

  const now = Date.now();
  const diff = now - timestamp;
  if (diff < 0) return "now";

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} d`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo`;

  const years = Math.floor(months / 12);
  return `${years} y`;
};

export const formatCurrency = (
  amount: number | string,
  currency: string = "INR"
) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currencyDisplay: "code",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

export const formatAddress = (address: string): string => {
  return address
    .split(" ")
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
    )
    .join(" ");
};

export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};
