const { default: axios } = require("axios");

const axiosClient = axios.create({
  baseURL: "http://192.168.8.101:1337/api",
});

const getCategory = () => axiosClient.get("/categories?populate=*");

const getProduct = () => axiosClient.get("/products?populate=*");

// const getProductbyId = (id: any) => axiosClient.get(`/products/:${id}`);

// async function getProductbyId(productId: string) {
//   try {
//     const res = await fetch(`http://localhost:1337/api${productId}`);
//     const product = await res.json();

//     if (!product) return null;
//     return product;
//   } catch (error) {}
// }

const getProductbyId = (productId: string) =>
  axiosClient.get(`/products/${productId}?populate=%2A`);

export default {
  getCategory,
  getProduct,
  getProductbyId,
};
