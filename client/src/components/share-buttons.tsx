import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link2, Check, MessageCircle, Send, Loader2 } from "lucide-react";
import { SiFacebook } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { NextdoorIcon } from "@/components/nextdoor-icon";
import { useAuth } from "@/hooks/use-auth";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);
  return isMobile;
}

interface ShareButtonsProps {
  url?: string;
  title: string;
  text: string;
}

export function ShareButtons({ url, title, text }: ShareButtonsProps) {
  const { toast } = useToast();
  const { session } = useAuth();
  const [copied, setCopied] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sending, setSending] = useState(false);
  const isMobile = useIsMobile();
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(text);
  const smsBody = `${text} ${shareUrl}`;
  const smsHref = `sms:?body=${encodeURIComponent(smsBody)}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link Copied!", description: "Paste it anywhere to share." });
    setTimeout(() => setCopied(false), 2000);
  };

  const openShare = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleSendSms = async () => {
    if (!phoneNumber.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ to: phoneNumber, message: smsBody }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      toast({ title: "Text Sent!", description: `Message sent to ${phoneNumber}` });
      setSmsOpen(false);
      setPhoneNumber("");
    } catch (err: any) {
      toast({ title: "Failed to Send", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={() => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}
              data-testid="button-share-facebook"
            >
              <SiFacebook className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on Facebook</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={() => openShare(`https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`)}
              data-testid="button-share-x"
            >
              <FaXTwitter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on X</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={() => openShare(`https://nextdoor.com/sharekit/?source=pawtraitpals&body=${encodedText}%20${encodedUrl}`)}
              data-testid="button-share-nextdoor"
            >
              <NextdoorIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on Nextdoor</TooltipContent>
        </Tooltip>
        {isMobile ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <a href={smsHref}>
                <Button
                  size="icon"
                  variant="outline"
                  data-testid="button-share-sms"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent>Send via Text</TooltipContent>
          </Tooltip>
        ) : session ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setSmsOpen(true)}
                data-testid="button-share-sms"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send via Text</TooltipContent>
          </Tooltip>
        ) : null}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopyLink}
              data-testid="button-copy-link"
            >
              {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copied!" : "Copy Link"}</TooltipContent>
        </Tooltip>
      </div>

      <Dialog open={smsOpen} onOpenChange={setSmsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send via Text</DialogTitle>
            <DialogDescription>Enter a phone number to text this link to.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              placeholder="(555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendSms()}
              disabled={sending}
              className="flex-1"
            />
            <Button onClick={handleSendSms} disabled={sending || !phoneNumber.trim()}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
