import PolicyPage from '../components/PolicyPage';

export default function ReturnPolicy() {
  return (
    <PolicyPage
      title="Return Policy"
      lastUpdated="18 June 2026"
      intro="We want every Banleofashion purchase to feel right. This policy explains how and when you can return an item to us."
      sections={[
        {
          heading: 'Return Window',
          content: (
            <p>You have <strong className="text-black">3 days</strong> from the date of delivery to request a return. Requests submitted after this period will not be accepted, so please inspect your order as soon as it arrives.</p>
          ),
        },
        {
          heading: 'Conditions for Return',
          content: (
            <>
              <p>To be eligible for a return, your item must:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Be unworn, unwashed, and free of stains, odours, or alterations</li>
                <li>Have all original tags, labels, and packaging intact</li>
                <li>Be accompanied by your order number or proof of purchase</li>
              </ul>
              <p className="mt-3">Items that do not meet these conditions will be sent back to you and will not be eligible for a return.</p>
            </>
          ),
        },
        {
          heading: 'Non-Returnable Items',
          content: (
            <>
              <p>The following are not eligible for return under any circumstances, except where the item is defective or incorrect:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Made-to-order pieces</li>
                <li>Custom or bespoke pieces created to your measurements or specifications</li>
                <li>Items marked "Final Sale"</li>
                <li>Sale or discounted items (unless stated otherwise at checkout)</li>
                <li>Earrings, intimate wear, or other items where hygiene applies</li>
              </ul>
              <p className="mt-3">Because made-to-order and custom pieces are produced specifically for you, they cannot be resold and are therefore excluded from our standard return policy.</p>
            </>
          ),
        },
        {
          heading: 'How to Initiate a Return',
          content: (
            <ol className="list-decimal pl-5 space-y-2">
              <li>Email us at <a href="mailto:support@banleofashion.com" className="underline hover:text-black">support@banleofashion.com</a> within 3 days of receiving your order, including your order number and reason for return.</li>
              <li>Our team will review your request and confirm whether the item qualifies.</li>
              <li>If approved, we'll provide instructions on how and where to send the item back.</li>
              <li>Pack the item securely, ideally in its original packaging, and send it to the address provided.</li>
            </ol>
          ),
        },
        {
          heading: 'Damaged, Defective, or Incorrect Items',
          content: (
            <p>If your order arrives damaged, defective, or is not what you ordered, contact us within 3 days of delivery with clear photos of the item and packaging. This applies even to made-to-order and custom pieces. We will arrange a replacement, repair, refund, or other resolution depending on the situation.</p>
          ),
        },
        {
          heading: 'Return Shipping Costs',
          content: (
            <ul className="list-disc pl-5 space-y-1">
              <li>If the return is due to our error (defective, damaged, or wrong item sent), Banleofashion covers the cost of return shipping.</li>
              <li>If the return is due to a change of mind, the customer is responsible for the cost of shipping the item back to us.</li>
            </ul>
          ),
        },
        {
          heading: 'Inspection & Approval',
          content: (
            <ol className="list-decimal pl-5 space-y-2">
              <li>Once we receive your returned item, we will inspect it within <strong className="text-black">5 business days</strong> to confirm it meets the return conditions.</li>
              <li>We'll notify you once the inspection is complete, along with next steps (refund, exchange, or store credit, depending on what you've requested and what's eligible).</li>
            </ol>
          ),
        },
        {
          heading: 'Related Policies',
          content: (
            <p>For details on how refunds are processed once a return is approved, see our Refund Policy. For swapping an item instead of returning it, see our Exchange Policy.</p>
          ),
        },
      ]}
    />
  );
}
