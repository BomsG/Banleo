import PolicyPage from '../components/PolicyPage';

export default function RefundPolicy() {
  return (
    <PolicyPage
      title="Refund Policy"
      lastUpdated="18 June 2026"
      intro="This policy explains when refunds apply, how they are calculated, and how they are paid out for Banleofashion orders."
      sections={[
        {
          heading: 'When Refunds Apply',
          content: (
            <>
              <p>Refunds are issued in the following situations:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>A returned item has been received and approved under our Return Policy (within the 3-day window, and meeting all return conditions)</li>
                <li>An item arrives damaged, defective, or different from what was ordered — including made-to-order and custom pieces</li>
                <li>An order is cancelled before it has been processed or shipped</li>
                <li>An item you ordered is out of stock and cannot be fulfilled</li>
              </ul>
              <p className="mt-3">Refunds are not automatically issued for change-of-mind requests on made-to-order, custom, or final sale items, as these are non-returnable under our Return Policy.</p>
            </>
          ),
        },
        {
          heading: 'Refund Method',
          content: (
            <p>All approved refunds are paid back to the original payment method used at checkout (debit/credit card, Paystack, or other payment channel used). We do not issue cash refunds or refunds to a different account or card than the one used to pay.</p>
          ),
        },
        {
          heading: 'Refund Timeline',
          content: (
            <>
              <p>Once a return is received and approved, or a refund request is otherwise confirmed:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>We process the refund on our end within <strong className="text-black">5 business days.</strong></li>
                <li>Depending on your bank or card provider, it may take an additional <strong className="text-black">5–10 business days</strong> for the funds to reflect in your account. This timeline is determined by your bank and is outside our control.</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Refund Amount',
          content: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Refunds cover the cost of the item(s) returned or affected.</li>
              <li>Original shipping/delivery fees are non-refundable, except where the issue was due to our error (wrong item, damage, defect).</li>
              <li>If only part of an order is being refunded, only that portion of the item cost will be refunded.</li>
            </ul>
          ),
        },
        {
          heading: 'Order Cancellations',
          content: (
            <>
              <p>If you wish to cancel an order, contact us as soon as possible at <a href="mailto:support@banleofashion.com" className="underline hover:text-black">support@banleofashion.com</a>.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>If the order has not yet been processed or shipped, we will cancel it and issue a full refund to your original payment method.</li>
                <li>If the order has already been processed, is in production (for made-to-order items), or has shipped, it cannot be cancelled, and our standard Return/Exchange terms will apply instead.</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Declined Refund Requests',
          content: (
            <>
              <p>We reserve the right to decline a refund if:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>The request falls outside the 3-day return window</li>
                <li>The item does not meet the conditions outlined in our Return Policy</li>
                <li>The item is a made-to-order, custom, or final sale piece and is not defective or incorrect</li>
                <li>There is evidence of misuse, alteration, or wear inconsistent with normal inspection</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Store Credit',
          content: (
            <p>In some cases — for example, where an exact replacement is unavailable — we may offer store credit instead of a refund to your original payment method, but only with your agreement. Store credit does not expire for 3 months from the date of issue.</p>
          ),
        },
        {
          heading: 'Related Policies',
          content: (
            <p>This Refund Policy works alongside our Return Policy and Exchange Policy. Please review those for full details on eligibility and timelines before reaching out.</p>
          ),
        },
      ]}
    />
  );
}
