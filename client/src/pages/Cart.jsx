import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useCart();

  const decreaseQuantity = (item) => {
    if (item.quantity <= 1) {
      removeFromCart(item._id);
      return;
    }

    updateQuantity(item._id, item.quantity - 1);
  };

  const increaseQuantity = (item) => {
    if (item.quantity < item.stock) {
      updateQuantity(item._id, item.quantity + 1);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 text-center shadow">
          <h1 className="mb-4 text-3xl font-bold">
            Your Cart
          </h1>

          <p className="mb-6 text-gray-600">
            Your shopping cart is empty.
          </p>

          <Link
            to="/products"
            className="inline-block rounded-lg bg-black px-6 py-3 text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            Shopping Cart
          </h1>

          <Link
            to="/products"
            className="text-blue-600 hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-5 rounded-xl bg-white p-5 shadow sm:flex-row sm:items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-32 w-32 rounded-lg object-cover"
              />

              <div className="flex-1">
                <Link
                  to={`/product/${item._id}`}
                  className="text-xl font-semibold hover:underline"
                >
                  {item.name}
                </Link>

                <p className="mt-1 text-sm text-gray-500">
                  {item.category}
                </p>

                <p className="mt-2 font-bold">
                  Rs. {item.price.toLocaleString()}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Available stock: {item.stock}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQuantity(item)}
                  className="h-10 w-10 rounded-lg border text-lg"
                >
                  −
                </button>

                <span className="min-w-8 text-center font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQuantity(item)}
                  disabled={item.quantity >= item.stock}
                  className="h-10 w-10 rounded-lg border text-lg disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <div className="min-w-32 text-right">
                <p className="font-bold">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </p>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="mt-3 text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xl font-semibold">
              Total
            </span>

            <span className="text-2xl font-bold">
              Rs. {cartTotal.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={clearCart}
              className="flex-1 rounded-lg border border-red-500 px-5 py-3 text-red-600"
            >
              Clear Cart
            </button>

            <Link
              to="/checkout"
              className="flex-1 rounded-lg bg-black px-5 py-3 text-center text-white"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;