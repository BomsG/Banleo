import PolicyPage from '../components/PolicyPage';

export default function ExchangePolicy() {
  return (
    <PolicyPage
      title="Exchange Policy"
      lastUpdated="18 June 2026"
      intro="At Banleofashion, we want you to love what you order. If something isn't quite right, we're happy to help you exchange it — subject to the terms below."
      sections={[
        {
          heading: 'Exchange Window',
          content: <p>You may request an exchange within <strong className="text-black">3 days</strong> of receiving your order. Requests made after this window will not be accepted.</p>,
        },
        {
          heading: 'Eligibility for Exchange',
          content: (<><p>To qualify for an exchange, an item must be:</p><ul className="list-disc pl-5 space-y-1 mt-2"><li>Unworn, unwashed, and unaltered</li><li>In its original condition, with all tags attached</li><li>Returned in its original packaging where possible</li><li>Accompanied by proof of purchase (order number or receipt)</li></ul></>),
        },
        {
          heading: 'What Cannot Be Exchanged',
          content: (<><p>The following items are final sale and not eligible for exchange:</p><ul className="list-disc pl-5 space-y-1 mt-2"><li>Made-to-order pieces</li><li>Custom or bespoke pieces made to your specific measurements</li><li>Items marked "Final Sale" at checkout</li><li>Underwear, swimwear, or other intimate items, for hygiene reasons</li><li>Items damaged through misuse or improper care after delivery</li></ul></>),
        },
        {
          heading: 'How to Request an Exchange',
          content: (<ol className="list-decimal pl-5 space-y-2"><li>Contact us at <a href="mailto:support@banleofashion.com" className="underline hover:text-black">support@banleofashion.com</a> within 3 days of delivery, with your order number and reason for the exchange.</li><li>Our team will confirm eligibility and provide instructions on how to send the item back.</li><li>Once we receive and inspect the item, we'll process the exchange.</li></ol>),
        },
        {
          heading: 'Sizing Exchanges',
          content: <p>If you ordered the wrong size, let us know as soon as possible. Exchanges are subject to stock availability — if your preferred size is unavailable, we'll offer a store credit or alternative item of equal value instead.</p>,
        },
        {
          heading: 'Defective or Incorrect Items',
          content: <p>If you receive an item that is damaged, defective, or different from what you ordered (including made-to-order or custom pieces), contact us within 3 days of delivery with photos. We will arrange a replacement, repair, or other resolution at no extra cost.</p>,
        },
        {
          heading: 'Shipping Costs',
          content: (<ul className="list-disc pl-5 space-y-1"><li>If the exchange is due to our error, Banleofashion covers all shipping costs.</li><li>If the exchange is due to a change of mind or sizing preference, the customer covers return shipping, and we cover sending the replacement out.</li></ul>),
        },
        {
          heading: 'Processing Time',
          content: <p>Once your returned item is received and inspected, exchanges are typically processed within <strong className="text-black">5 business days</strong>.</p>,
        },
      ]}
    />
  );
}
