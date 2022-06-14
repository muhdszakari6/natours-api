import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51LALqfBjweXZCTdyRp7LLriP1BB82eaiqPT1k30L5gK8pzpt5cL6PQMlHabrcEpMs4GVzeeU51TiM8EcasoDguBF00TrwnymJU'
  );

  try {
    //Get the session from the server
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    console.log(session);
    //Use Stipe to create checkout form
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(err);
    showAlert('error', err);
  }
};
