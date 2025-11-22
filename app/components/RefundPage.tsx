'use client';

import { useRouter } from 'next/navigation';
import TopSection from './TopSection';
import BottomNavigation from './BottomNavigation';

interface RefundPageProps {
  onNavigate?: (screen: string) => void;
}

export default function RefundPage({ onNavigate }: RefundPageProps = {}) {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
      {/* Desktop Container */}
      <div className="w-full">
        {/* Top Section with Logo */}
        <div className="relative z-10">
          <TopSection showLogo={true} />
        </div>

        {/* Back Button */}
        <div className="px-4 md:px-6 lg:px-8 mb-4">
          <button
            type="button"
            onClick={() => {
              if (onNavigate) {
                onNavigate('home');
              } else {
                router.push('/dashboard');
              }
            }}
            className="flex items-center cursor-pointer"
            style={{
              color: '#7F8CAA',
              fontFamily: 'Poppins',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: '16px',
              lineHeight: '100%',
              letterSpacing: '0%'
            }}
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110-2H5.414l4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            go back
          </button>
        </div>

        {/* Page Title */}
        <div className="px-4 md:px-6 lg:px-8 mb-6">
          <h1 className="text-white font-bold text-2xl sm:text-3xl">Refund Policy</h1>
          <p className="text-gray-400 text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="px-4 md:px-6 lg:px-8 pb-24">
          <div 
            className="p-6 rounded-2xl"
            style={{ 
              background: 'linear-gradient(90deg, #7F8CAA 0%, #5C667C 100%)',
              boxShadow: '0px 4px 4px 0px #00000040'
            }}
          >
            <div className="space-y-6 text-white">
              <section>
                <h2 className="text-xl font-bold mb-3">1. Refund Eligibility</h2>
                <p className="text-sm leading-relaxed mb-4">
                  At Creds Zone, we understand that sometimes you may need to request a refund. Refunds are available under the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                  <li>Failed transactions where payment was deducted but top-up was not completed</li>
                  <li>Duplicate transactions due to technical errors</li>
                  <li>Incorrect game account information provided by the user (subject to verification)</li>
                  <li>Service unavailability or technical issues on our platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">2. Non-Refundable Items</h2>
                <p className="text-sm leading-relaxed mb-4">
                  The following are not eligible for refunds:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                  <li>Successfully completed top-ups and recharges</li>
                  <li>Digital goods that have been delivered and activated</li>
                  <li>Transactions completed more than 7 days ago</li>
                  <li>Refunds requested due to user error in account details</li>
                  <li>Promotional or discounted items (unless specified otherwise)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">3. Refund Process</h2>
                <p className="text-sm leading-relaxed mb-4">
                  To request a refund, please follow these steps:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm ml-4">
                  <li>Contact our customer support team via WhatsApp or email within 48 hours of the transaction</li>
                  <li>Provide your transaction ID, order number, and reason for refund</li>
                  <li>Our team will review your request within 2-3 business days</li>
                  <li>If approved, refunds will be processed to your original payment method within 5-7 business days</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">4. Refund Timeline</h2>
                <p className="text-sm leading-relaxed">
                  Refunds are typically processed within 5-7 business days after approval. The time it takes for the refund to appear in your account depends on your payment method:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm ml-4 mt-4">
                  <li>UPI: 1-3 business days</li>
                  <li>Credit/Debit Cards: 5-7 business days</li>
                  <li>Wallet Balance: Instant (credited back to your Creds Zone wallet)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">5. Contact Us</h2>
                <p className="text-sm leading-relaxed">
                  For refund requests or inquiries, please contact us:
                </p>
                <ul className="list-none space-y-2 text-sm ml-4 mt-4">
                  <li>📱 WhatsApp: <a href="https://wa.me/9863796664" target="_blank" rel="noopener noreferrer" className="underline">+91 9863796664</a></li>
                  <li>📧 Email: support@credszone.com</li>
                  <li>🌐 Website: <a href="https://credszone.com" target="_blank" rel="noopener noreferrer" className="underline">www.credszone.com</a></li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">6. Dispute Resolution</h2>
                <p className="text-sm leading-relaxed">
                  If you are not satisfied with our refund decision, you may escalate your concern to our support team. We are committed to resolving all disputes fairly and promptly.
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Bottom Spacing for Fixed Navigation */}
        <div className="h-15"></div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </div>
  );
}

