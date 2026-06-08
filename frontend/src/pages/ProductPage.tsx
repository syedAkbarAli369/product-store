import { useState } from "react";
import { ArrowLeftIcon, EditIcon, Trash2Icon, CalendarIcon, UserIcon } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import CommentsSection from "../components/CommentsSection";
import { useProduct, useDeleteProduct } from "../hooks/useProduct";
import { useParams, Link, useNavigate } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
}

interface Comment {
  id: string;
  content: string;
  userId: number;
  productId: string;
  createdAt: string;
  user: User;
}

interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  comments?: Comment[];
}

const getUserInitial = (user?: User) => {
  if (!user?.name) return "?";
  return user.name.charAt(0).toUpperCase();
};

function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthContext();

  const { data: productRaw, isLoading, error } = useProduct(id!);
  const deleteProduct = useDeleteProduct();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const product: Product | undefined = productRaw?.product ?? productRaw;

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    deleteProduct.mutate(id!, {
      onSuccess: () => {
        toast.success("Product deleted successfully");
        navigate("/");
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to delete product");
      },
    });
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !product) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">Product not found</h2>
          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.id === product.userId;
  const currentUserId = currentUser?.id ?? null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="btn btn-ghost btn-sm gap-1">
          <ArrowLeftIcon className="size-4" /> Back
        </Link>
        {isOwner && (
          <div className="flex gap-2">
            <Link to={`/edit/${product.id}`} className="btn btn-ghost btn-sm gap-1">
              <EditIcon className="size-4" /> Edit
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-error btn-sm gap-1"
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <Trash2Icon className="size-4" />
              )}
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="card bg-base-200 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-error">Confirm Deletion</h2>
              <p>Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-error" onClick={handleDeleteConfirm}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Image */}
        <div className="card bg-base-300">
          <figure className="p-4">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="rounded-xl w-full h-80 object-cover"
            />
          </figure>
        </div>

        <div className="card bg-base-300">
          <div className="card-body">
            <h1 className="card-title text-2xl">{product.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-base-content/60 my-2">
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4" />
                {new Date(product.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="size-4" />
                {product.user?.name}
              </div>
            </div>

            <div className="divider my-2"></div>

            <p className="text-base-content/80 leading-relaxed">{product.description}</p>

            <div className="mt-2">
              <span className="text-lg font-bold text-primary">
                ₨ {product.price.toLocaleString()}
              </span>
              <span className="text-xs text-base-content/50 ml-1">PKR</span>
            </div>

            {product.user && (
              <>
                <div className="divider my-2"></div>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    {product.user.imageUrl ? (
                      <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img
                          src={product.user.imageUrl}
                          alt={product.user.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="w-12 rounded-full bg-primary text-primary-content flex items-center justify-center text-lg font-bold ring ring-primary ring-offset-base-100 ring-offset-2">
                        {getUserInitial(product.user)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{product.user.name}</p>
                    <p className="text-xs text-base-content/50">Creator</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="card bg-base-300">
        <div className="card-body">
          <CommentsSection
            productId={id!}
            comments={product.comments}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;