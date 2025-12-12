export const formatUSD = (usd?: number) =>
  usd === undefined ? "—" : `$${usd.toFixed(6)}`;

