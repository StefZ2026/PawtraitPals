import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckSquare, MessageSquare, ShieldCheck, Send } from "lucide-react";

export default function SmsOptIn() {
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const canSend = phone.trim().length > 0 && smsConsent && privacyConsent;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">SMS Opt-In</h1>
          <p className="text-muted-foreground">How Pawtrait Pals handles text messaging consent</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <MessageSquare className="h-6 w-6 text-primary mt-0.5 shrink-0" />
              <div>
                <h2 className="font-semibold text-lg mb-2">How It Works</h2>
                <p className="text-muted-foreground">
                  Pawtrait Pals allows rescue organizations to share pet portraits via text message.
                  When viewing a pet portrait, users can click "Send via Text" to share the portrait
                  link with a phone number of their choice. <strong>No SMS is ever sent without
                  the user first checking both consent boxes below and clicking Send.</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <CheckSquare className="h-6 w-6 text-primary mt-0.5 shrink-0" />
              <div>
                <h2 className="font-semibold text-lg mb-2">Opt-In Form</h2>
                <p className="text-muted-foreground mb-4">
                  Before any SMS can be sent, the user must enter a phone number and
                  manually check <strong>both</strong> consent checkboxes. The Send button
                  remains disabled until both boxes are checked. Try it below:
                </p>

                <div className="bg-muted/50 rounded-lg p-5 border">
                  <p className="font-medium mb-3">Send via Text</p>
                  <p className="text-sm text-muted-foreground mb-3">Enter a phone number to text this link to.</p>
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="(555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1"
                    />
                    <Button disabled={!canSend} size="icon" variant="default"
                      onClick={(e) => { e.preventDefault(); alert("This is a demo — no SMS is sent from this page."); }}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3 mb-4">
                    <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smsConsent}
                        onChange={(e) => setSmsConsent(e.target.checked)}
                        className="mt-0.5 rounded border-gray-300"
                      />
                      <span>By providing this phone number, you agree to receive SMS messages from Pawtrait Pals. Message frequency may vary. Standard message and data rates may apply. Reply STOP to opt out. Reply HELP for help. We will not share mobile information with third parties for promotional or marketing purposes.</span>
                    </label>
                    <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacyConsent}
                        onChange={(e) => setPrivacyConsent(e.target.checked)}
                        className="mt-0.5 rounded border-gray-300"
                      />
                      <span>I have read and agree to the Pawtrait Pals <a href="/privacy" className="underline text-primary">Privacy Policy</a>.</span>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {canSend
                      ? "Both consent boxes checked — Send button is now active."
                      : "The Send button is disabled until both checkboxes above are voluntarily checked by the user."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <ShieldCheck className="h-6 w-6 text-primary mt-0.5 shrink-0" />
              <div>
                <h2 className="font-semibold text-lg mb-2">Your Rights</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Opt-out:</strong> Reply STOP to any message to stop receiving texts from this number.</li>
                  <li><strong>Help:</strong> Reply HELP for support information, or email stefanie@pawtraitpals.com.</li>
                  <li><strong>Messaging:</strong> Message frequency may vary. SMS is sent only when a user explicitly initiates a share action.</li>
                  <li><strong>Data rates:</strong> Standard message and data rates may apply.</li>
                  <li><strong>No sharing:</strong> We will not share mobile information with third parties for promotional or marketing purposes.</li>
                  <li><strong>Data:</strong> Phone numbers are not stored after delivery.</li>
                  <li><strong>Privacy:</strong> See our full <a href="/privacy" className="underline text-primary">Privacy Policy</a> (Section 7: SMS/Text Messaging).</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Pawtrait Pals LLC &bull; <a href="mailto:stefanie@pawtraitpals.com" className="underline">stefanie@pawtraitpals.com</a> &bull; <a href="/terms" className="underline">Terms</a> &bull; <a href="/privacy" className="underline">Privacy</a>
        </p>
      </div>
    </div>
  );
}
