import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  return (
    <div className="border p-4 rounded shadow flex flex-col">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="mb-2 h-48 object-cover"
      />
      <h3 className="font-bold">{product.title}</h3>
      <p className="text-gray-600">${product.price}</p>
      <div className="mt-auto flex gap-2">
        <button
          onClick={() => addToCart(product)}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Add to Cart
        </button>
        <button
          onClick={() => addToWishlist(product)}
          className="bg-pink-500 text-white px-2 py-1 rounded"
        >
          Wishlist
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
