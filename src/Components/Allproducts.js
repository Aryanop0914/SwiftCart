import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
// import image from "../img/buds.png";

function Allproducts() {
  const location = useLocation();
  const { category } = useParams();
  // const category = location.state.category;
  const [products, setProducts] = useState([]);
  console.log(location);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [category]);

  return (
    <section className="text-gray-400 bg-gray-900 body-font">
      <div className="container px-5 py-24 mx-auto">
        <h1>{category}</h1>
        <div className="flex flex-wrap -m-4">
          {products.map((product) => (
            <div className="lg:w-1/4 md:w-1/2 p-4 w-full" key={product.id}>
              <Link
                to="/item"
                className="block relative h-48 rounded overflow-hidden"
              >
                <img
                  alt="ecommerce"
                  className="object-cover object-center w-full h-full block"
                  src={product.image}
                />
              </Link>
              <div className="mt-4">
                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                  {product.category}
                </h3>
                <h2 className="text-white title-font text-lg font-medium">
                  {product.title}
                </h2>
                <p className="mt-1"> ₹ {product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Allproducts;
