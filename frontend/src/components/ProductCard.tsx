import { Link } from "react-router";
import { MessageCircleIcon } from "lucide-react";

// Define types (ideally import from a shared types file)
interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
  // ... other user fields as needed
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
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  comments?: Comment[];
}

interface ProductCardProps {
  product: Product;
}

const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const getUserInitial = (user?: User) => {
  if (!user?.name) return "?"
  return user.name.charAt(0).toUpperCase()
}

const ProductCard = ({ product }: ProductCardProps) => {
  const isNew = new Date(product.createdAt) > oneWeekAgo;

  return (
    <Link
      to={`/product/${product.id}`}
      className="card bg-base-300 hover:bg-base-200 transition-colors"
    >
      <figure className="px-4 pt-4">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="rounded-xl h-45 w-full object-cover object-fit object-center"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-base">
          {product.title}
          {isNew && <span className="badge badge-secondary badge-sm">NEW</span>}
        </h2>
        <p className="text-sm text-base-content/70 line-clamp-2">{product.description}</p>

        <div className="divider my-1"></div>

        <div className="flex items-center justify-between">
          {product.user && (
            <div className="flex items-center gap-2">
              <div className="avatar">
                {product.user.imageUrl ? (
                  <div className="w-6 rounded-full ring-1 ring-primary">
                    <img
                      src={product.user.imageUrl}
                      alt={product.user.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-6 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold ring-1 ring-primary">
                    {getUserInitial(product.user)}
                  </div>
                )}
              </div>
              <span className="text-xs text-base-content/60">{product.user.name}</span>
            </div>
          )}
          {product.comments && (
            <div className="flex items-center gap-1 text-base-content/50">
              <MessageCircleIcon className="size-3" />
              <span className="text-xs">{product.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;