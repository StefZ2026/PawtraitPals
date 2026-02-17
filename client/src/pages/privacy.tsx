import { Link } from "wouter";
import { Dog, Cat } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-1.5 font-serif text-2xl font-bold text-primary">
            <span className="flex items-center gap-0.5"><Dog className="h-6 w-6" /><Cat className="h-6 w-6" /></span>
            Pawtrait Pals
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <h1 className="text-3xl font-serif font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: February 17, 2026</p>

        <div className="prose prose-stone dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-serif font-semibold mb-3">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pawtrait Pals ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services at pawtraitpals.com (the "Service"). By using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold mb-3">2. Information We Collect</h2>
            <h3 className="text-lg font-semibold mb-2">Account Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              When you create an account, we collect your email address and password. Accounts are managed through Supabase, a secure authentication provider. We do not store your password directly — it is handled by Supabase's authentication infrastructure.
            </p>
            <h3 className="text-lg font-semibold mb-2">Organization Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Rescue organizations provide information including organization name, description, location, website, logo, and contact details. This information is displayed publicly on your rescue showcase page to help adopters find and connect with your organization.
            </p>
            <h3 className="text-lg font-semibold mb-2">Pet Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You may upload pet photos, names, breeds, ages, species, descriptions, and other details about animals available for adoption. Pet photos are used to generate AI-powered artistic portraits.
            </p>
            <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Payment processing is handled by Stripe. We do not store your credit card numbers or bank account details. Stripe collects and processes payment information in accordance with their own privacy policy. We receive only transaction confirmation details (such as subscription status and plan type).
            </p>
            <h3 className="text-lg font-semibold mb-2">Automatically Collected Information</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may collect standard web server logs including IP addresses, browser type, referring pages, and timestamps. This data is used for security monitoring and service improvement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide and maintain the Service, including generating AI portraits of your pets</li>
              <li>To create and manage your account and organization profile</li>
              <li>To process subscription payments through Stripe</li>
              <li>To display your rescue organization and available pets on public showcase pages</li>
              <li>To enable sharing of pet profiles via social media and text messaging</li>
              <li>To send transactional communications related to your account</li>
              <li>To monitor and improve the security and performance of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold mb-3">4. AI Portrait Generation</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pet photos you upload are sent to Google's Gemini AI service to generate artistic portraits. These images are processed solely for the purpose of creating your requested portraits. We do not use your pet photos for AI model training. Generated portraits are stored in our database and associated with your pet profiles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold mb-3">5. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Service providers:</strong> Supabase (authentication and database), Stripe (payments), Google Gemini (AI portrait generation), and Render (hosting) — each bound by their own privacy policies</li>
              <li><strong>Public showcase pages:</strong> Organization name, description, location, logo, and pet profiles (including portraits) that you choose to make public are visible to anyone visiting your rescue's showcase page</li>
              <li><strong>Legal requirements:</strong> We may disclose information if required by law or in response to valid legal process</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold mb-3">6. Data Storage and Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is stored securely using Supabase's PostgreSQL database infrastructure hosted on Amazon Web Services (AWS) in the United States. We use industry-standard security measures including encrypted connections (SSL/TLS), secure authentication tokens, and role-based access controls. While we strive to protect your information, no method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold mb-3">7. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Remove pet profiles and uploaded photos at any time</li>
              <li>Cancel your subscription at any time</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise any of these rights, please contact us at stefanie@pawtraitpals.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold mb-3">8. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will take steps to delete that information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold mb-3">9. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-semibold mb-3">10. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:stefanie@pawtraitpals.com" className="text-primary hover:underline">
                stefanie@pawtraitpals.com
              </a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
