import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import { useProducts, useMyProducts } from "../hooks/useProduct";
import { useAuthContext } from "../context/AuthContext";
import { PackageIcon, UserIcon } from "lucide-react";
import { Link } from "react-router";
import cheelImage from "/cp.png";


const HomePage = () => {
  const { isAuthenticated } = useAuthContext();
  const [showMyProducts, setShowMyProducts] = useState(false);

  const allProductsQuery = useProducts();
  const myProductsQuery = useMyProducts();

  const isMyMode = showMyProducts && isAuthenticated;
  const {
    data: products,
    isLoading,
    error,
  } = isMyMode ? myProductsQuery : allProductsQuery;

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        <span>Something went wrong. Please refresh the page.</span>
      </div>
    );
  }

  const productList = Array.isArray(products) ? products : [];

  return (
    <div className="space-y-10"
      style={{ fontFamily: 'AEONIK' }}
    >
      <div className="hero bg-linear-to-br from-base-300 via-base-200 to-base-300 rounded-box overflow-hidden">
        <div className="hero-content flex-col lg:flex-row-reverse gap-10 py-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110" />
            <img
              src={cheelImage}
              alt="Creator"
              className="relative h-64 lg:h-72 rounded-2xl shadow-2xl"
            />
          </div>
          <div className="lg:pl-16">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight"
              style={{ fontFamily: 'LEMONMILK-BOLD' }}
            >
              Share Your <span className="text-primary">Products</span>
            </h1>
            <p className="py-4 text-base-content/60">
              Upload, discover, and connect with creators.
            </p>
            <div>
              <Link to="/register" className="btn btn-primary btn-md mt-3 rounded-2xl">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PackageIcon className="size-5 text-primary" />
            {isMyMode ? "My Products" : "All Products"}
          </h2>

          {isAuthenticated && (
            <button
              onClick={() => setShowMyProducts(!showMyProducts)}
              className={`btn btn-sm gap-1 ${showMyProducts ? "btn-primary" : "btn-ghost"
                }`}
            >
              <UserIcon className="size-4" />
              {showMyProducts ? "Show All" : "My Products"}
            </button>
          )}
        </div>

        {productList.length === 0 ? (
          <div className="card bg-base-300">
            <div className="card-body items-center text-center py-16">
              <PackageIcon className="size-16 text-base-content/20" />
              <h3 className="card-title text-base-content/50">
                {isMyMode ? "You haven't posted any products yet" : "No products yet"}
              </h3>
              <p className="text-base-content/40 text-sm">
                {isMyMode
                  ? "Create your first product and share it with the community!"
                  : "Be the first to share something!"}
              </p>
              <Link to="/create" className="btn btn-primary btn-sm mt-2">
                Create Product
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;