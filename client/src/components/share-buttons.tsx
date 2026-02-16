import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Link2, Check, MessageCircle } from "lucide-react";
import { SiFacebook } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { NextdoorIcon } from "@/components/nextdoor-icon";

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
  const [copied, setCopied] = useState(false);
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

  return (
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
      {isMobile && (
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
      )}
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
  );
}
