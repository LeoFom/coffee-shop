export default function CheckoutForm() {
  return (
    <form className="space-y-8">
      <section className="bg-white rounded-3xl p-8">
        <h2 className="text-2xl font-semibold text-brand-brown mb-6">
          Contact Information
        </h2>

        <div className="space-y-4">
          <input
            placeholder="Email"
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            placeholder="Phone"
            className="w-full border rounded-xl px-4 py-3"
          />
        </div>
      </section>

      <section className="bg-white rounded-3xl p-8">
        <h2 className="text-2xl font-semibold text-brand-brown mb-6">
          Shipping Address
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="First Name"
            className="border rounded-xl px-4 py-3"
          />

          <input
            placeholder="Last Name"
            className="border rounded-xl px-4 py-3"
          />

          <input
            placeholder="Country"
            className="border rounded-xl px-4 py-3 md:col-span-2"
          />

          <input
            placeholder="City"
            className="border rounded-xl px-4 py-3"
          />

          <input
            placeholder="Postal Code"
            className="border rounded-xl px-4 py-3"
          />

          <input
            placeholder="Street Address"
            className="border rounded-xl px-4 py-3 md:col-span-2"
          />
        </div>
      </section>

      <section className="bg-white rounded-3xl p-8">
        <h2 className="text-2xl font-semibold text-brand-brown mb-6">
          Delivery Method
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="border rounded-2xl p-5 cursor-pointer hover:border-brand-brown">
            <input type="radio" name="delivery" className="mr-2" />
            Standard Delivery
          </label>

          <label className="border rounded-2xl p-5 cursor-pointer hover:border-brand-brown">
            <input type="radio" name="delivery" className="mr-2" />
            Express Delivery
          </label>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-8">
        <h2 className="text-2xl font-semibold text-brand-brown mb-6">
          Payment
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="border rounded-2xl p-5">
            <input type="radio" name="payment" className="mr-2" />
            Credit Card
          </label>

          <label className="border rounded-2xl p-5">
            <input type="radio" name="payment" className="mr-2" />
            PayPal
          </label>
        </div>
      </section>
    </form>
  );
}