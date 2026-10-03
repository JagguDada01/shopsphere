import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatINR } from '../utils/format.js';

const PINCODE_PATTERN = /^[1-9]\d{5}$/;
const PINCODE_ERROR = 'Enter a valid 6-digit pincode that does not start with 0.';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(
    user?.address || { line1: '', city: '', state: '', pincode: '' }
  );
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [error, setError] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [placing, setPlacing] = useState(false);

  const update = (key) => (e) => {
    const { value } = e.target;
    setAddress((a) => ({ ...a, [key]: value }));
    if (key === 'pincode') {
      setPincodeError(PINCODE_PATTERN.test(value) ? '' : PINCODE_ERROR);
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!PINCODE_PATTERN.test(address.pincode)) {
      setPincodeError(PINCODE_ERROR);
      return;
    }
    setPlacing(true);
    setError('');
    try {
      const { data } = await api.post('/orders', {
        items: items.map(({ product, name, price, quantity }) => ({ product, name, price, quantity })),
        shippingAddress: address,
        paymentMethod,
      });
      clearCart();
      navigate('/orders', { state: { placed: data._id } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) return <p className="muted">Nothing to check out.</p>;

  return (
    <section className="checkout">
      <form className="card form" onSubmit={placeOrder}>
        <h1>Shipping details</h1>
        <input required placeholder="Address line" value={address.line1} onChange={update('line1')} />
        <input required placeholder="City" value={address.city} onChange={update('city')} />
        <input required placeholder="State" value={address.state} onChange={update('state')} />
        <input
          required
          type="text"
          inputMode="numeric"
          pattern="[1-9][0-9]{5}"
          placeholder="Pincode"
          value={address.pincode}
          onChange={update('pincode')}
          onInvalid={(e) => {
            e.preventDefault();
            setPincodeError(PINCODE_ERROR);
          }}
          aria-invalid={Boolean(pincodeError)}
          aria-describedby={pincodeError ? 'pincode-error' : undefined}
        />
        {pincodeError && <p id="pincode-error" className="error">{pincodeError}</p>}

        <label>Payment method</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="COD">Cash on delivery</option>
          <option value="ONLINE" disabled>Online payment (coming soon)</option>
        </select>

        {error && <p className="error">{error}</p>}
        <button className="btn full" disabled={placing}>
          {placing ? 'Placing order...' : `Place order · ${formatINR(totalPrice)}`}
        </button>
      </form>
    </section>
  );
}
