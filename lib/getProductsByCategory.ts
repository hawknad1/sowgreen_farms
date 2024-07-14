async function getProductsByCategory(category: string) {
  const res = await fetch(`/api/categories/${category}`);
  const data = await res.json();
  return data;
}

export default getProductsByCategory;
