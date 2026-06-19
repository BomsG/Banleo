import PolicyPage from '../components/PolicyPage';

export default function CookiePolicy() {
  return (
    <PolicyPage
      title="Cookie Policy"
      lastUpdated="18 June 2026"
      intro="This Cookie Policy explains how Banleofashion uses cookies and similar technologies on our website, in line with the Nigeria Data Protection Act (NDPA) 2023. It should be read alongside our Privacy Policy."
      sections={[
        {
          heading: 'What Are Cookies',
          content: (
            <p>Cookies are small text files placed on your device when you visit a website. They help the website function properly, remember your preferences, and give us insight into how the site is used. Similar technologies covered by this policy include pixels, tags, and local storage.</p>
          ),
        },
        {
          heading: 'Types of Cookies We Use',
          content: (
            <div className="space-y-5">
              {[
                { label: 'Strictly Necessary Cookies', desc: 'These are essential for our website to function — for example, enabling you to browse pages, add items to your cart, and complete checkout securely. These cookies do not require your consent, as the website cannot operate properly without them.' },
                { label: 'Performance & Analytics Cookies', desc: 'These help us understand how visitors use our website (e.g. which pages are visited most, how long visitors stay) so we can improve the shopping experience. Examples may include Google Analytics or similar tools.' },
                { label: 'Functionality Cookies', desc: 'These remember your preferences, such as saved items, currency, or display settings, to make your visit more convenient.' },
                { label: 'Marketing & Advertising Cookies', desc: 'These track your browsing activity to help us (and our advertising partners, such as Meta/Instagram or Google) deliver relevant ads and measure their effectiveness. These are only set with your consent.' },
              ].map((c) => (
                <div key={c.label}>
                  <p className="font-bold text-black text-xs uppercase tracking-widest mb-1">{c.label}</p>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>
          ),
        },
        {
          heading: 'Third-Party Cookies',
          content: (
            <>
              <p>Some cookies on our website may be set by third parties whose services we use, such as:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Payment processors (e.g. Paystack, Flutterwave) — for secure checkout</li>
                <li>Analytics providers (e.g. Google Analytics)</li>
                <li>Social media and advertising platforms (e.g. Meta/Instagram Pixel, TikTok Pixel)</li>
              </ul>
              <p className="mt-3">These third parties may use cookies in accordance with their own privacy and cookie policies, which we encourage you to review.</p>
            </>
          ),
        },
        {
          heading: 'Your Consent & Choices',
          content: (
            <>
              <p>When you first visit our website, you will be shown a cookie banner allowing you to accept or manage non-essential cookies. In line with the NDPA, we only set non-essential cookies with your informed, specific, freely given, and unambiguous consent.</p>
              <p className="mt-3">You can change or withdraw your cookie preferences at any time by:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Adjusting your choices via the cookie settings link in our footer</li>
                <li>Adjusting your browser settings to block or delete cookies (note: this may affect how parts of our website function)</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'How Long Cookies Last',
          content: (
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-black">Session cookies</strong> are temporary and deleted once you close your browser.</li>
              <li><strong className="text-black">Persistent cookies</strong> remain on your device for a set period (or until manually deleted) to remember your preferences across visits.</li>
            </ul>
          ),
        },
        {
          heading: 'Updates to This Policy',
          content: (
            <p>We may update this Cookie Policy from time to time to reflect changes in the cookies and technologies we use, or for legal and regulatory reasons. The "Last updated" date above will reflect the most recent revision.</p>
          ),
        },
      ]}
    />
  );
}
