import { Link } from "react-router";
import { ShoppingBagIcon, PlusIcon } from "lucide-react"; // UserIcon removed (not used)
import ThemeSelector from "./ThemeSelector";
import { useAuthContext } from "../context/AuthContext";
import { useLogout } from "../hooks/useAuth";

const Navbar = () => {
  // ✅ Get user from context
  const { isAuthenticated, isVerified, user } = useAuthContext();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Helper to get first letter of user's name
  const getUserInitial = () => {
    if (!user?.name) return "?";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div className="navbar bg-base-300" style={{ fontFamily: "LEMONMILK" }}>
      <div className="max-w-6xl mx-auto w-full md:px-3 flex justify-between items-center">
        {/* LEFT */}
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost gap-2">
            <ShoppingBagIcon className="size-5 text-primary" />
            <span className="text-lg font-bold uppercase tracking-wide">Cheelify</span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex gap-2 items-center">
          <ThemeSelector />

          {isAuthenticated ? (
            <>
              <Link to="/create" className="btn btn-primary btn-sm gap-1">
                <PlusIcon className="size-4" />
                <span className="hidden sm:inline">New Product</span>
              </Link>

              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  {user?.imageUrl ? (
                    <div className="w-6 rounded-full">
                      <img src={user.imageUrl} alt={user.name || "User"} />
                    </div>
                  ) : (
                    <div className="w-6 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold">
                      {getUserInitial()}
                    </div>
                  )}
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-200 rounded-box z-50 w-54 p-2 shadow-xl"
                  style={{ fontFamily: "AEONIK" }}
                >
                  {!isVerified && (
                    <li>
                      <Link to="/verify-email">Verify Account</Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;