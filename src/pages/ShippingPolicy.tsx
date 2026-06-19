import PolicyPage from '../components/PolicyPage';

export default function ShippingPolicy() {
  return (
    <PolicyPage
      title="Shipping Policy"
      lastUpdated="18 June 2026"
      intro="This page explains how Banleofashion handles shipping and delivery for all orders placed on our website."
      sections={[
        {
          heading: 'Delivery Coverage',
          content: <p>We currently deliver within <strong className="text-black">Nigeria only</strong>. We do not offer international shipping at this time. If you are outside Nigeria and would like to place an order, please contact us directly at <a href="mailto:support@banleofashion.com" className="underline hover:text-black">support@banleofashion.com</a> and we will do our best to assist.</p>,
        },
        {
          heading: 'Shipping Fees',
          content: <p>Shipping fees are calculated based on your delivery location and will be displayed at checkout before you complete your order. The fee you see at checkout is the final shipping cost — no hidden charges are added after payment.</p>,
        },
        {
          heading: 'Delivery Timelines',
          content: (<><p>Delivery timelines begin from the date your order is dispatched, not from the date of purchase. Estimated delivery times:</p><ul className="list-disc pl-5 space-y-1 mt-2"><li><strong className="text-black">Lagos and Port Harcourt:</strong> 2–3 business days</li><li><strong className="text-black">Other states:</strong> 3–5 business days</li></ul><p className="mt-3">Delivery to remote or less accessible areas may take slightly longer.</p></>),
        },
        {
          heading: 'Order Tracking',
          content: <p>Once your order has been dispatched, you will receive a tracking number via email. You can use this to follow the progress of your delivery through our logistics partner.</p>,
        },
        {
          heading: 'Dispatch Times',
          content: <p>How quickly your order is dispatched depends on the type of item ordered. Ready-to-wear orders are dispatched immediately after confirmation. Made-to-order and custom pieces require 7–14 business days of production before dispatch. Please see our Orders &amp; Payment page for full details.</p>,
        },
        {
          heading: 'Failed or Missed Deliveries',
          content: <p>If a delivery attempt is unsuccessful because no one is available to receive it, our logistics partner will contact you to arrange redelivery. Please ensure your contact details and delivery address are accurate at the time of ordering. Banleofashion is not responsible for failed deliveries resulting from incorrect address information provided by the customer.</p>,
        },
        {
          heading: 'Delays',
          content: <p>While we work with reliable logistics partners, delivery timelines are estimates and are not guaranteed. Banleofashion is not liable for delays caused by third-party couriers, traffic, weather, public holidays, or other circumstances beyond our control. If your order is significantly delayed, please contact us and we will follow up with our logistics partner on your behalf.</p>,
        },
        {
          heading: 'Damaged or Lost Parcels',
          content: <p>If your parcel arrives damaged or appears to have been tampered with, please take photos immediately before opening and contact us at <a href="mailto:support@banleofashion.com" className="underline hover:text-black">support@banleofashion.com</a> within 24 hours of delivery. If a parcel is confirmed lost in transit, we will work with the logistics provider to resolve the issue as quickly as possible.</p>,
        },
      ]}
    />
  );
}
