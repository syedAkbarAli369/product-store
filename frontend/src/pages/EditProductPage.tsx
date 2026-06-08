import { Link, useNavigate, useParams } from "react-router";
import { useProduct, useUpdateProduct } from "../hooks/useProduct";
import React, { useState, useEffect } from "react";
import { ArrowLeftIcon, FileTextIcon, ImageIcon, SparklesIcon, TypeIcon, DollarSignIcon } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

interface ProductFormData {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
}

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: productRaw, isLoading, error } = useProduct(id!);
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    imageUrl: "",
    price: 0,
  });

  // Pre-fill form when product data is loaded
  useEffect(() => {
    if (productRaw?.product) {
      const product = productRaw.product;
      setFormData({
        title: product.title,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
      });
    } else if (productRaw && !productRaw.product) {
      // If API returns product directly (no wrapper)
      setFormData({
        title: productRaw.title,
        description: productRaw.description,
        imageUrl: productRaw.imageUrl,
        price: productRaw.price,
      });
    }
  }, [productRaw]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProduct.mutate(
      { id: id!, ...formData },
      {
        onSuccess: () => navigate(`/product/${id}`),
      }
    );
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = "none";
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !productRaw) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto mt-10">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">Product not found</h2>
          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Link to={`/product/${id}`} className="btn btn-ghost btn-sm gap-1 mb-4">
        <ArrowLeftIcon className="size-4" /> Back to Product
      </Link>

      <div className="card bg-base-300">
        <div className="card-body">
          <h1 className="card-title" style={{ fontFamily: 'LEMONMILK' }}>
            <SparklesIcon className="size-5 text-primary" />
            Edit Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <TypeIcon className="size-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Product title"
                className="grow"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <ImageIcon className="size-4 text-base-content/50" />
              <input
                type="url"
                placeholder="Image URL"
                className="grow"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                required
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <DollarSignIcon className="size-4 text-base-content/50" />
              <input type="number"
                placeholder="Price in PKR"
                className="grow"
                value={formData.price === 0 ? "" : formData.price}
                onChange={(e) => {
                  const val = e.target.value
                  setFormData({ ...formData, price: val === "" ? 0 : parseFloat(val) })
                }}
                required
              />
            </label>

            {formData.imageUrl && (
              <div className="rounded-box overflow-hidden">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                  onError={handleImageError}
                />
              </div>
            )}

            <div>
              <div className="flex gap-3">
                <FileTextIcon className="size-4 text-base-content/50 mt-1" />
                <textarea
                  placeholder="Description"
                  className="grow bg-transparent resize-none focus:outline-none min-h-24"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </div>

            {updateProduct.isError && (
              <div role="alert" className="alert alert-error alert-sm">
                <span>Failed to update. Try again.</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={updateProduct.isPending}>
              {updateProduct.isPending ? (
                <span className="loading loading-spinner" />
              ) : (
                "Update Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;