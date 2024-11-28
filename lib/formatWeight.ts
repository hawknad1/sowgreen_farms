// utils/weightConverter.ts
export const formatWeight = (weightInKg: number): string => {
  if (weightInKg < 1) {
    const weightInGrams = weightInKg * 1000 // Convert to grams
    return `${weightInGrams}`
  } else {
    return `${weightInKg}`
  }
}
