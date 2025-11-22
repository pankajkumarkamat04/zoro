'use client';

import { useRouter } from 'next/navigation';
import TopSection from './TopSection';
import BottomNavigation from './BottomNavigation';

interface PrivacyPolicyPageProps {
  onNavigate?: (screen: string) => void;
}

export default function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps = {}) {
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden p-0 m-0" style={{ backgroundColor: '#232426' }}>
      {/* Desktop Container */}
      <div className="max-w-7xl mx-auto">
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
          <h1 className="text-white font-bold text-2xl sm:text-3xl">Privacy Policy</h1>
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
                <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
                <p className="text-sm leading-relaxed">
                  At Leaf Store (leafstore.in), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">2. Information We Collect</h2>
                <p className="text-sm leading-relaxed mb-4">
                  We collect the following types of information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, and profile picture</li>
                  <li><strong>Account Information:</strong> Game account details (Player ID, Server, etc.) for top-up services</li>
                  <li><strong>Payment Information:</strong> Transaction details, payment method (processed securely through payment gateways)</li>
                  <li><strong>Usage Data:</strong> Device information, IP address, browser type, and usage patterns</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">3. How We Use Your Information</h2>
                <p className="text-sm leading-relaxed mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                  <li>Process and complete your top-up orders</li>
                  <li>Manage your account and provide customer support</li>
                  <li>Send transaction confirmations and important updates</li>
                  <li>Improve our services and user experience</li>
                  <li>Detect and prevent fraud or unauthorized transactions</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">4. Data Security</h2>
                <p className="text-sm leading-relaxed">
                  We implement industry-standard security measures to protect your information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">5. Data Sharing</h2>
                <p className="text-sm leading-relaxed mb-4">
                  We do not sell your personal information. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                  <li>With payment processors to complete transactions</li>
                  <li>With game publishers/developers to fulfill top-up orders</li>
                  <li>When required by law or legal process</li>
                  <li>To protect our rights, property, or safety</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">6. Cookies and Tracking</h2>
                <p className="text-sm leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our services. You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">7. Your Rights</h2>
                <p className="text-sm leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm ml-4">
                  <li>Access and review your personal information</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your account and data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">8. Data Retention</h2>
                <p className="text-sm leading-relaxed">
                  We retain your information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Transaction records may be retained for accounting and legal purposes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">9. Children's Privacy</h2>
                <p className="text-sm leading-relaxed">
                  Our services are not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">10. Changes to Privacy Policy</h2>
                <p className="text-sm leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">11. Contact Us</h2>
                <p className="text-sm leading-relaxed">
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                </p>
                <ul className="list-none space-y-2 text-sm ml-4 mt-4">
                  <li>📱 WhatsApp: <a href="https://wa.me/9863796664" target="_blank" rel="noopener noreferrer" className="underline">+91 9863796664</a></li>
                  <li>📧 Email: privacy@leafstore.in</li>
                  <li>🌐 Website: <a href="https://leafstore.in" target="_blank" rel="noopener noreferrer" className="underline">www.leafstore.in</a></li>
                </ul>
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

