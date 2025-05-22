export const truncate = (str: string, max: number): string =>
  str.length > max ? str.slice(0, max - 1) + "..." : str
