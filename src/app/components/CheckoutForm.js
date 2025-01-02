import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

const handleServerResponse = (data) => {
  console.log("\n\nDATA AQUI:\n ", data, "\n\n");

  window.alert(data.message);
  window.location.reload();
};

export default function CheckoutForm() {
  const apiLink =
    "https://73a7-2804-14c-65a0-45c4-fe45-75d0-ffa4-af90.ngrok-free.app";
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);

  const handleError = (error) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    // Create the ConfirmationToken using the details collected by the Payment Element
    // and additional shipping information
    const { error, confirmationToken } = await stripe.createConfirmationToken({
      elements,
      params: {
        shipping: {
          name: "Jenny Rosen",
          address: {
            line1: "1234 Main Street",
            city: "San Francisco",
            state: "CA",
            country: "US",
            postal_code: "94111",
          },
        },
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // creating the ConfirmationToken. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
      return;
    }

    console.log("\nconfirmation token:\n", confirmationToken);

    // Create the PaymentIntent
    const res = await fetch(`${apiLink}/api/v1/stripe/payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 60000,
        currency: "usd",
        customer: "cus_RVpgbU5IfshNZ3",
        metadata: {
          product_id: "prod_RVphXalY0ZV9uf",
        },
        confirmation_token: confirmationToken.id,
      }),
    });

    const data = await res.json();

    // Handle any next actions or errors. See the Handle any next actions step for implementation.
    handleServerResponse(data);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <PaymentElement />
      <div>
        <button type="submit" disabled={!stripe || loading}>
          Submit
        </button>
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    </form>
  );
}
