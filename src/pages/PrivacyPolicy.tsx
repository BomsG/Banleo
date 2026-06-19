import PolicyPage from '../components/PolicyPage';

export default function PrivacyPolicy() {
  return (
    <PolicyPage
      title="Privacy Policy"
      lastUpdated="18 June 2026"
      intro="Banleofashion respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, share, and protect your information when you visit our website, place an order, or otherwise interact with us, in line with the Nigeria Data Protection Act (NDPA) 2023."
      sections={[
        {
          heading: 'Who We Are',
          content: (
            <>
              <p>Banleofashion is a Nigerian fashion brand operating online.</p>
              <p><strong className="text-black">Data Controller:</strong> Banleofashion</p>
              <p><strong className="text-black">Registered address:</strong> No. 3 Nkpor Village Rumuolumeni, Port Harcourt, Rivers State, Nigeria</p>
              <p><strong className="text-black">Email:</strong> support@banleofashion.com</p>
            </>
          ),
        },
        {
          heading: 'Information We Collect',
          content: (
            <>
              <p><strong className="text-black">Information you give us directly:</strong></p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Full name, phone number, and email address</li>
                <li>Delivery and billing address</li>
                <li>Payment information (processed securely via our payment provider)</li>
                <li>Order history and preferences (e.g. sizing, style preferences for made-to-order pieces)</li>
                <li>Any information shared via email, WhatsApp, Instagram DM, or customer service requests</li>
              </ul>
              <p className="mt-4"><strong className="text-black">Information collected automatically:</strong></p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>IP address and approximate location</li>
                <li>Browser type, device type, and operating system</li>
                <li>Pages visited, time spent on site, and referring website</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Why We Collect Your Information',
          content: (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="text-left py-2 pr-4 font-bold uppercase tracking-widest text-black">Purpose</th>
                    <th className="text-left py-2 font-bold uppercase tracking-widest text-black">Legal Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {[
                    ['Processing and fulfilling your orders', 'Performance of a contract'],
                    ['Order communications (confirmations, delivery updates)', 'Performance of a contract'],
                    ['Responding to customer service enquiries', 'Performance of a contract / Legitimate interest'],
                    ['Sending marketing updates, new arrivals, or promotions', 'Consent'],
                    ['Improving our website and customer experience', 'Legitimate interest'],
                    ['Preventing fraud and ensuring payment security', 'Legal obligation / Legitimate interest'],
                    ['Complying with tax, accounting, or regulatory obligations', 'Legal obligation'],
                  ].map(([p, l]) => (
                    <tr key={p}>
                      <td className="py-2 pr-4 text-gray-600">{p}</td>
                      <td className="py-2 text-gray-600">{l}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        },
        {
          heading: 'How We Share Your Information',
          content: (
            <>
              <p>We do not sell your personal data. We may share your information with:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Payment processors (e.g. Paystack, Flutterwave) to process transactions securely</li>
                <li>Logistics and delivery partners to fulfil and deliver your order</li>
                <li>Service providers who support our operations (e.g. website hosting, email/SMS providers), under confidentiality obligations</li>
                <li>Regulatory or government authorities, where required by law</li>
                <li>Professional advisors (e.g. lawyers, accountants), where necessary</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'International Data Transfers',
          content: (
            <p>If any of our service providers store or process data outside Nigeria, we take reasonable steps to ensure such transfers comply with the NDPA's requirements for cross-border data transfer, including ensuring an adequate level of protection or appropriate safeguards are in place.</p>
          ),
        },
        {
          heading: 'Data Retention',
          content: (
            <>
              <p>We retain your personal data only for as long as necessary, including:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>For the duration of your relationship with us, plus a reasonable period afterward</li>
                <li>Order and transaction records: typically 2 years</li>
                <li>Marketing data: until you withdraw consent or unsubscribe</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Your Rights',
          content: (
            <>
              <p>Under the NDPA, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your data, subject to legal or contractual exceptions</li>
                <li>Object to certain processing, including direct marketing</li>
                <li>Withdraw consent at any time</li>
                <li>Request data portability</li>
                <li>Lodge a complaint with the Nigeria Data Protection Commission (NDPC) at <a href="https://www.ndpc.gov.ng" className="underline hover:text-black">ndpc.gov.ng</a></li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Payment Security',
          content: (
            <p>We do not store your full card details. Payments made on our website are processed through secure third-party payment processors (e.g. Paystack), which are independently responsible for the security of payment data in accordance with PCI-DSS standards.</p>
          ),
        },
        {
          heading: 'Children\'s Privacy',
          content: (
            <p>Our website and services are not directed at children under the age of 18. We do not knowingly collect personal data from children. If we become aware that we have inadvertently collected data from a minor, we will take steps to delete it.</p>
          ),
        },
        {
          heading: 'Data Security',
          content: (
            <p>We implement reasonable technical and organisational measures to protect your personal data against unauthorised access, loss, misuse, or alteration. While we take security seriously, no method of transmission or storage is 100% secure.</p>
          ),
        },
        {
          heading: 'Changes to This Policy',
          content: (
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The "Last updated" date at the top of this page will indicate when changes were made.</p>
          ),
        },
      ]}
    />
  );
}
