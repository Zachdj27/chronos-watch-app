import { useState, useMemo } from "react";
import "./App.css";

const WATCHES = [
  { id: 1, name: "Mariner GMT", brand: "Nordvik", style: "Luxury", color: "Silver", price: 2450, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80", specs: "40mm | 300m | Automatic", desc: "Swiss-crafted dual-timezone elegance with a sapphire crystal back." },
  { id: 2, name: "Obsidian Chrono", brand: "Veldthaus", style: "Sport", color: "Black", price: 1890, image: "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=400&q=80", specs: "44mm | 200m | Quartz", desc: "Built for high performance. Carbon-reinforced bezel layout." },
  { id: 3, name: "Aurore Minuit", brand: "Beaumont", style: "Minimalist", color: "Gold", price: 3200, image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&q=80", specs: "38mm | 50m | Automatic", desc: "Classic Parisian restraint. 18k gold-tone domed case profile." },
  { id: 4, name: "Sentinel Diver", brand: "Nordvik", style: "Sport", color: "Black", price: 1320, image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&q=80", specs: "42mm | 500m | Automatic", desc: "ISO-certified diving watch with unidirectional rotating bezel frame." },
  { id: 5, name: "Plaine Blanche", brand: "Beaumont", style: "Minimalist", color: "Silver", price: 870, image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&q=80", specs: "36mm | 30m | Quartz", desc: "Clean face profile layout without index numerals or visual noise." },
  { id: 6, name: "Grand Tourbillon", brand: "Veldthaus", style: "Luxury", color: "Gold", price: 8900, image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?w=400&q=80", specs: "41mm | 30m | Manual", desc: "Exquisite hand-finished complication viewable inside dial aperture." }
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("shop");
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);

  // Faceted Filter States
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [maxPrice, setMaxPrice] = useState(10000);

  // Checkout Multi-Step States
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({ name: "", email: "", address: "" });
  const [paymentInfo, setPaymentInfo] = useState({ card: "", promo: "" });

  // Survey States
  const [surveyRating, setSurveyRating] = useState(0);
  const [surveyText, setSurveyText] = useState("");
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const finalTotal = paymentInfo.promo.toUpperCase() === "CHRONOS20" ? cartSubtotal * 0.8 : cartSubtotal;

  // Real-time Faceted Search Filter Logic
  const filteredProducts = useMemo(() => {
    return WATCHES.filter(w => {
      if (selectedStyles.length && !selectedStyles.includes(w.style)) return false;
      if (selectedColors.length && !selectedColors.includes(w.color)) return false;
      if (w.price > maxPrice) return false;
      return true;
    });
  }, [selectedStyles, selectedColors, maxPrice]);

  const handleToggleFilter = (type, value) => {
    const state = type === "style" ? selectedStyles : selectedColors;
    const setter = type === "style" ? setSelectedStyles : setSelectedColors;
    setter(state.includes(value) ? state.filter(v => v !== value) : [...state, value]);
  };

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      return existing ? prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...prev, { ...product, qty: 1 }];
    });
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light text-dark">
      
      {/* header navbar */}
      <nav className="navbar navbar-dark bg-dark sticky-top px-3 shadow-sm">
        <span className="navbar-brand font-display fw-bold tracking-wider fs-4" style={{cursor: "pointer"}} onClick={() => setActiveTab("shop")}>CHRONOS</span>
        <div className="d-flex gap-3 align-items-center">
          <button className={`btn btn-sm ${activeTab === 'shop' ? 'text-warning fw-bold' : 'text-light'}`} onClick={() => setActiveTab("shop")}>Shop</button>
          <button className={`btn btn-sm ${activeTab === 'about' ? 'text-warning fw-bold' : 'text-light'}`} onClick={() => setActiveTab("about")}>About</button>
          <button className="btn btn-outline-light btn-sm position-relative ms-2" onClick={() => setShowCheckout(true)}>
            🛒 Cart {cartCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* render tab contents */}
      {activeTab === "about" ? (
        <main className="container my-5 py-5" style={{ maxWidth: "700px" }}>
          <h1 className="font-display mb-4">Our Horological Philosophy</h1>
          <p className="text-muted">Chronos was founded by collectors committed to design clarity. We avoid shortcut manufacturing, choosing instead to bring curated engineering directly to our clients.</p>
        </main>
      ) : (
        <main className="flex-grow-1">
          {/* hero announcement banner */}
          <section className="bg-dark text-white text-center py-5 border-bottom border-secondary">
            <div className="container py-3" style={{ maxWidth: "600px" }}>
              <span className="text-warning text-uppercase small tracking-widest fw-bold">Limited Summer Offer</span>
              <h1 className="font-display display-5 my-2">Time, Refined.</h1>
              <p className="text-secondary small">Apply promo code <code className="text-warning fw-bold">CHRONOS20</code> to save 20% flat on luxury listings today.</p>
            </div>
          </section>

          <div className="container my-5">
            <div className="row g-4">
              
              {/* filter view panel */}
              <aside className="col-lg-3">
                <div className="sticky-sidebar p-3 bg-white rounded border shadow-sm">
                  <h5 className="font-display mb-3 border-bottom pb-2">Filter Catalog</h5>
                  
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted text-uppercase">Style Architecture</label>
                    {["Luxury", "Sport", "Minimalist"].map(s => (
                      <div className="form-check small" key={s}>
                        <input className="form-check-input" type="checkbox" checked={selectedStyles.includes(s)} onChange={() => handleToggleFilter("style", s)} id={`style-${s}`} />
                        <label className="form-check-input-label" htmlFor={`style-${s}`}> {s}</label>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted text-uppercase">Metal Trim Color</label>
                    {["Silver", "Gold", "Black"].map(c => (
                      <div className="form-check small" key={c}>
                        <input className="form-check-input" type="checkbox" checked={selectedColors.includes(c)} onChange={() => handleToggleFilter("color", c)} id={`color-${c}`} />
                        <label className="form-check-input-label" htmlFor={`color-${c}`}> {c}</label>
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted text-uppercase d-flex justify-content-between">
                      <span>Max Budget</span>
                      <span className="text-dark">${maxPrice.toLocaleString()}</span>
                    </label>
                    <input type="range" className="form-range" min="500" max="10000" step="100" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
                  </div>

                  <button className="btn btn-sm btn-link p-0 text-decoration-none small text-muted mt-2" onClick={() => { setSelectedStyles([]); setSelectedColors([]); setMaxPrice(10000); }}>✕ Reset Search</button>
                </div>
              </aside>

              {/* products display grid */}
              <section className="col-lg-9">
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                  {filteredProducts.map(w => (
                    <div className="col" key={w.id}>
                      <div className="watch-card h-100 d-flex flex-column p-3 shadow-sm">
                        <div className="watch-img-container rounded mb-3">
                          <img src={w.image} alt={w.name} className="watch-img" />
                        </div>
                        <span className="text-uppercase text-warning small fw-bold">{w.brand}</span>
                        <h5 className="font-display text-dark my-1">{w.name}</h5>
                        {/* product description overview */}
                        <p className="text-muted small my-2 flex-grow-1">{w.desc}</p>
                        <div className="bg-light p-2 rounded text-center text-muted small border mb-3">{w.specs}</div>
                        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                          <span className="fs-5 fw-bold font-display text-dark">${w.price.toLocaleString()}</span>
                          <button className="btn btn-sm btn-gold px-3" onClick={() => handleAddToCart(w)}>Add to Cart</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-12 text-center my-5 py-5 text-muted">No timepieces match your active selection filters.</div>
                  )}
                </div>
              </section>

            </div>
          </div>
        </main>
      )}

      {/* footer view linking to feedback */}
      <footer className="bg-dark text-white py-4 mt-auto border-top border-secondary text-center small text-secondary">
        <button className="btn btn-sm btn-outline-warning text-uppercase px-3 fw-bold" onClick={() => { setSurveySubmitted(false); setShowSurvey(true); }}>
          Tell Us How We Did
        </button>
      </footer>

      {/* checkout instructions */}
      {showCheckout && (
        <div className="custom-modal-backdrop">
          <div className="bg-white p-4 rounded shadow-lg w-100" style={{ maxWidth: "500px" }}>
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <h5 className="m-0 font-display text-dark fw-bold">Secure Gateway Terminal</h5>
              <button className="btn-close" onClick={() => { setShowCheckout(false); setCheckoutStep(0); }}></button>
            </div>

            {/* step completion tracker */}
            <div className="d-flex justify-content-between align-items-center mb-4 bg-light p-2 rounded text-center small">
              {["Cart Review", "Delivery Data", "Payment", "Receipt"].map((stepLabel, i) => (
                <div key={i} className="d-flex flex-column align-items-center flex-grow-1">
                  <span className={`step-circle ${i <= checkoutStep ? "active" : ""}`}>{i < checkoutStep ? "✓" : i + 1}</span>
                  <span className="small text-muted mt-1" style={{ fontSize: "0.68rem" }}>{stepLabel}</span>
                </div>
              ))}
            </div>

            {/* progress form */}
            {checkoutStep === 0 && (
              <div>
                <h6 className="mb-3 font-display fw-bold">1. Order Pipeline Assessment</h6>
                {cart.length === 0 ? <p className="text-muted my-4 text-center">Empty session. Add a watch item to start checkout.</p> : (
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {cart.map(item => (
                      <div className="d-flex justify-content-between align-items-center border-bottom py-2 small" key={item.id}>
                        <div><strong>{item.name}</strong> <span className="text-muted">x{item.qty}</span></div>
                        <div>${(item.price * item.qty).toLocaleString()}</div>
                      </div>
                    ))}
                    <div className="text-end fw-bold pt-2 fs-6">Subtotal: ${cartSubtotal.toLocaleString()}</div>
                  </div>
                )}
              </div>
            )}

            {checkoutStep === 1 && (
              <div className="row g-2">
                <h6 className="mb-2 font-display fw-bold">2. Logistical Destination Parameters</h6>
                <div className="col-12"><input type="text" className="form-control form-control-sm" placeholder="Full Name Name Label" value={shippingInfo.name} onChange={e => setShippingInfo({...shippingInfo, name: e.target.value})} /></div>
                <div className="col-12"><input type="email" className="form-control form-control-sm" placeholder="Contact Destination Email" value={shippingInfo.email} onChange={e => setShippingInfo({...shippingInfo, email: e.target.value})} /></div>
                <div className="col-12"><input type="text" className="form-control form-control-sm" placeholder="Street Delivery Coordinate Lines" value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})} /></div>
              </div>
            )}

            {checkoutStep === 2 && (
              <div className="row g-2">
                <h6 className="mb-2 font-display fw-bold">3. Financial Ledger Resolution</h6>
                <div className="col-12"><input type="text" className="form-control form-control-sm" placeholder="16 Digit Financial Card Code" value={paymentInfo.card} onChange={e => setPaymentInfo({...paymentInfo, card: e.target.value})} /></div>
                <div className="col-12">
                  <input type="text" className="form-control form-control-sm" placeholder="Promo Code (Optional)" value={paymentInfo.promo} onChange={e => setPaymentInfo({...paymentInfo, promo: e.target.value})} />
                  {paymentInfo.promo.toUpperCase() === "CHRONOS20" && <span className="text-success small fw-bold mt-1 d-block">✓ Active promo code matched (-20%)</span>}
                </div>
                <div className="bg-light p-2 rounded small mt-3">
                  <div className="d-flex justify-content-between"><span>Base Summary Value:</span><span>${cartSubtotal.toLocaleString()}</span></div>
                  <div className="d-flex justify-content-between fw-bold border-top pt-1 mt-1"><span>Settlement Total:</span><span>${finalTotal.toLocaleString()}</span></div>
                </div>
              </div>
            )}

            {checkoutStep === 3 && (
              <div className="text-center py-3">
                <span className="fs-1">✓</span>
                <h5 className="font-display my-2">Checkout Completed</h5>
                <p className="text-muted small">Your package processing sequence is now operating under tracking reference identifier code.</p>
              </div>
            )}

            {/* interactinos navigation footer */}
            <div className="d-flex justify-content-between mt-4 border-top pt-3">
              {checkoutStep > 0 && checkoutStep < 3 && <button className="btn btn-sm btn-outline-secondary" onClick={() => setCheckoutStep(s => s - 1)}>Back</button>}
              {checkoutStep < 3 ? (
                <button className="btn btn-sm btn-gold ms-auto" disabled={checkoutStep === 0 && cart.length === 0} onClick={() => {
                  if (checkoutStep === 2) setCart([]);
                  setCheckoutStep(s => s + 1);
                }}>{checkoutStep === 2 ? "Finalize Purchase Order" : "Continue"}</button>
              ) : (
                <button className="btn btn-sm btn-dark w-100" onClick={() => { setShowCheckout(false); setCheckoutStep(0); setShowSurvey(true); }}>Close Window & Complete Survey</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* server user input */}
      {showSurvey && (
        <div className="custom-modal-backdrop">
          <div className="bg-white p-4 rounded shadow-lg w-100" style={{ maxWidth: "450px" }}>
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <h5 className="m-0 font-display text-dark fw-bold">Honest Dialogue Exchange</h5>
              <button className="btn-close" onClick={() => setShowSurvey(false)}></button>
            </div>
            
            {!surveySubmitted ? (
              <div>
                <p className="text-muted small">Did you experience absolute clarity navigating our layout profiles today? Tell us what adjustments you want to see built next.</p>
                
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase text-muted d-block">Overall Satisfaction Index</label>
                  <div className="btn-group w-100" role="group">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button key={score} type="button" className={`btn btn-sm ${surveyRating === score ? "btn-warning text-dark" : "btn-outline-secondary"}`} onClick={() => setSurveyRating(score)}>
                        {score} ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase text-muted">Qualitative Improvements Form</label>
                  <textarea className="form-control form-control-sm" rows="3" placeholder="Provide system optimization recommendations here..." value={surveyText} onChange={(e) => setSurveyText(e.target.value)}></textarea>
                </div>

                <button className="btn btn-sm btn-gold w-100 py-2 mt-2" disabled={surveyRating === 0} onClick={() => setSurveySubmitted(true)}>Transmit System Report</button>
              </div>
            ) : (
              <div className="text-center py-4">
                <span className="fs-1">✉</span>
                <h5 className="font-display my-2">Metrics Saved Successfully</h5>
                <p className="text-muted small">We review submitted survey parameters to adjust accessibility balances. Thank you for collaborating directly with us.</p>
                <button className="btn btn-sm btn-dark px-4 mt-2" onClick={() => setShowSurvey(false)}>Close Window</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
