import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { cart } = useCart();
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * (Number(item.quantity) || 1), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + subtotal * 0.1 + shipping;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Checkout</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Review your order</h1>
          <p className="mt-3 text-slate-600">EROH Shop currently uses DummyJSON, a demonstration API. It does not provide real order processing or payment collection, so no payment will be taken here.</p>
          {cart.length === 0 ? (
            <div className="mt-8 rounded-xl bg-slate-50 p-6 text-center">
              <p className="font-medium text-slate-800">Your cart is empty.</p>
              <Link to="/products" className="mt-4 inline-flex rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white">Browse products</Link>
            </div>
          ) : (
            <>
              <div className="mt-8 divide-y divide-slate-100 border-y border-slate-100">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 py-4 text-sm">
                    <span className="text-slate-700">{item.title} × {item.quantity || 1}</span>
                    <span className="font-semibold text-slate-900">${(Number(item.price || 0) * (Number(item.quantity) || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax (10%)</span><span>${(subtotal * 0.1).toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-950"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              <div role="status" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Demo mode: connect a trusted backend and payment provider before accepting real customer orders.</div>
              <Link to="/cart" className="mt-6 inline-flex rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50">Return to cart</Link>
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default Checkout;
