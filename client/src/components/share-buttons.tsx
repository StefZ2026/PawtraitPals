import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link2, Check, MessageCircle, Send, Loader2 } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";
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
  dogId?: number;
  dogName?: string;
  dogBreed?: string;
}

export function ShareButtons({ url, title, text, dogId, dogName, dogBreed }: ShareButtonsProps) {
  const { toast } = useToast();
  const { session, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [igOpen, setIgOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sending, setSending] = useState(false);
  const [igPosting, setIgPosting] = useState(false);
  const [igCaption, setIgCaption] = useState("");
  const isMobile = useIsMobile();
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(text);
  const smsBody = `${text} ${shareUrl}`;
  const smsHref = `sms:?body=${encodeURIComponent(smsBody)}`;

  // Check Instagram connection status
  const { data: igStatus } = useQuery<{ connected: boolean; username?: string; orgId?: number }>({
    queryKey: ["/api/instagram/status"],
    enabled: isAuthenticated && !!dogId,
  });

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

  const handleOpenIgPost = () => {
    const defaultCaption = `Meet ${dogName || 'this adorable pet'}! ${dogBreed ? `A beautiful ${dogBreed} ` : ''}Looking for a forever home. View their full profile at ${shareUrl}\n\n#adoptdontshop #rescuepets #pawtraitpals #fosteringsaveslives`;
    setIgCaption(defaultCaption);
    setIgOpen(true);
  };

  const handlePostToInstagram = async () => {
    if (!dogId) return;
    setIgPosting(true);
    try {
      const res = await fetch("/api/instagram/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ dogId, caption: igCaption }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post");
      toast({ title: "Posted to Instagram!", description: `${dogName || 'Pet'}'s portrait is now on Instagram.` });
      setIgOpen(false);
    } catch (err: any) {
      toast({ title: "Instagram Post Failed", description: err.message, variant: "destructive" });
    } finally {
      setIgPosting(false);
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
        {igStatus?.connected && dogId ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                onClick={handleOpenIgPost}
                data-testid="button-share-instagram"
              >
                <SiInstagram className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Post to Instagram{igStatus.username ? ` @${igStatus.username}` : ''}</TooltipContent>
          </Tooltip>
        ) : null}
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

      <Dialog open={igOpen} onOpenChange={setIgOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SiInstagram className="h-5 w-5" />
              Post to Instagram
            </DialogTitle>
            <DialogDescription>
              {igStatus?.username ? `Posting to @${igStatus.username}` : 'Post this portrait to your Instagram'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea
              value={igCaption}
              onChange={(e) => setIgCaption(e.target.value)}
              rows={5}
              placeholder="Write a caption..."
              disabled={igPosting}
              className="resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIgOpen(false)} disabled={igPosting}>
                Cancel
              </Button>
              <Button onClick={handlePostToInstagram} disabled={igPosting}>
                {igPosting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <SiInstagram className="h-4 w-4 mr-2" />}
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
