import PolicyPage from '../components/PolicyPage';

export default function OrdersPayment() {
  return (
    <PolicyPage
      title="Orders & Payment"
      lastUpdated="18 June 2026"
      intro="This page explains how orders are placed, processed, and paid for at Banleofashion."
      sections={[
        {
          heading: 'Placing an Order',
          content: <p>Orders can be placed directly through our website. Once your order is submitted, you will receive a confirmation via email containing your order details. Please review this carefully and contact us immediately at <a href="mailto:support@banleofashion.com" className="underline hover:text-black">support@banleofashion.com</a> if any information needs to be corrected.</p>,
        },
        {
          heading: 'Order Processing',
          content: (<><p>How quickly your order moves into production or dispatch depends on the type of item ordered:</p><ul className="list-disc pl-5 space-y-1 mt-2"><li><strong className="text-black">Ready-to-wear pieces</strong> are processed immediately after your order is confirmed.</li><li><strong className="text-black">Made-to-order and custom pieces</strong> require a production period of 7 to 14 business days before they are ready to ship. Our team will reach out to confirm your measurements and any design details before production begins.</li></ul></>),
        },
        {
          heading: 'Order Confirmation',
          content: <p>An order is only considered confirmed once payment has been received in full. You will receive a confirmation message once this is done. If you do not receive a confirmation within 24 hours after placing your order, please contact us to verify.</p>,
        },
        {
          heading: 'Cancellations',
          content: (<><p>If you need to cancel an order, contact us as soon as possible.</p><ul className="list-disc pl-5 space-y-1 mt-2"><li><strong className="text-black">Ready-to-wear orders</strong> can be cancelled before processing begins. Once processing has started, cancellation may not be possible.</li><li><strong className="text-black">Made-to-order and custom orders</strong> can be cancelled before production begins. Once production has started, the order cannot be cancelled as the piece is being made specifically for you.</li></ul><p className="mt-3">Where a cancellation is approved, a full refund will be issued to your original payment method.</p></>),
        },
        {
          heading: 'Payment Methods',
          content: (<><p>We accept the following payment methods:</p><ul className="list-disc pl-5 space-y-1 mt-2"><li>Debit and credit cards</li><li>Paystack</li></ul><p className="mt-3">All transactions are processed securely. Banleofashion does not store your card details.</p></>),
        },
        {
          heading: 'Payment Terms',
          content: <p>Full payment is required before any order is confirmed and processed, including made-to-order and custom pieces. We do not offer part-payment or pay-on-delivery at this time.</p>,
        },
        {
          heading: 'Pricing',
          content: <p>All prices displayed on our website are in <strong className="text-black">Nigerian Naira (₦)</strong>. Prices are subject to change without notice, but any change will not affect an order that has already been confirmed and paid for.</p>,
        },
        {
          heading: 'Order Issues',
          content: <p>If your order arrives damaged, incomplete, or different from what you ordered, contact us within 3 days of delivery. Please see our Return Policy, Exchange Policy, and Refund Policy for full details on how we handle these situations.</p>,
        },
      ]}
    />
  );
}
