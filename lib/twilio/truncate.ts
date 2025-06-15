// export const truncate = (str: string, max: number): string =>
//   str.length > max ? str.slice(0, max - 1) + "..." : str

export const truncate = (str: string | undefined | null, max: number): string =>
  typeof str === "string" && str.length > max
    ? str.slice(0, max - 1) + "..."
    : str ?? ""
