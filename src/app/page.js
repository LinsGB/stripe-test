"use client";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QZFlcRuirp0MXVGMdOUMHsHz3XwFDsUZfYE48798rIib7YwToAwUgRFAUlCHR5dBDN6XopFDvbgYMXqCmRomgDV007xdIrVmT"
);

export default function Home() {
  const options = {
    mode: "payment",
    amount: 7500,
    currency: "usd",
    paymentMethodCreation: "manual",
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
  };
  return (
    <div className="container">
      <h1 className="title">Checkout test</h1>
      <div className="checkout">
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}
