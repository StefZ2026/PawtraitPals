import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Heart, Palette, Share2, Sparkles, Dog, Cat, Building2, LogOut, LayoutDashboard, LayoutGrid, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Home() {
  const { user, isLoading, isAuthenticated, logout, isLoggingOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-1.5 font-serif text-2xl font-bold text-primary" data-testid="link-home">
            <span className="flex items-center gap-0.5"><Dog className="h-6 w-6" /><Cat className="h-6 w-6" /></span>
            Pawtrait Pals
          </Link>
          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" data-testid="link-gallery" asChild>
              <Link href="/gallery">Gallery</Link>
            </Button>
            {isLoading ? (
              <div className="w-24 h-9 bg-muted animate-pulse rounded-md" />
            ) : isAuthenticated ? (
              <>
                <Button variant="ghost" className="gap-2" data-testid="link-dashboard" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                    <AvatarFallback>{user?.firstName?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="icon" data-testid="button-logout" onClick={() => logout()} disabled={isLoggingOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <a href="/login">
                  <Button variant="ghost" data-testid="button-login">Log In</Button>
                </a>
                <a href="/login">
                  <Button data-testid="button-get-started">Get Started</Button>
                </a>
              </>
            )}
          </nav>
          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 pt-12">
              <nav className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/gallery" onClick={() => setMobileOpen(false)}>Gallery</Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/styles" onClick={() => setMobileOpen(false)}>Styles</Link>
                </Button>
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" className="justify-start gap-2" asChild>
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2" onClick={() => { logout(); setMobileOpen(false); }} disabled={isLoggingOut}>
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <a href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">Log In</Button>
                    </a>
                    <a href="/login" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </a>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Pet Portraits</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
              Transform Rescue Pets into{" "}
              <span className="text-primary">Adoptable Art</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Help adoptable dogs and cats find their furever homes with beautiful AI-generated portraits. 
              Choose from 40+ artistic styles including Renaissance and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Button size="lg" className="gap-2" data-testid="button-go-to-dashboard" asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-5 w-5" />
                      Go to Dashboard
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2" data-testid="button-view-gallery" asChild>
                    <Link href="/gallery">
                      View Gallery
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <a href="/login">
                    <Button size="lg" className="gap-2" data-testid="button-create-portrait">
                      <Palette className="h-5 w-5" />
                      Create a Portrait
                    </Button>
                  </a>
                  <Button size="lg" variant="outline" className="gap-2" data-testid="button-view-gallery" asChild>
                    <Link href="/gallery">
                      View Gallery
                    </Link>
                  </Button>
                </>
              )}
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-primary" />
                Free 30-day trial
              </span>
              <span>No credit card required</span>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {[
              { style: "Renaissance Noble", image: "/images/styles/renaissance-noble.jpg" },
              { style: "Egyptian Royalty", image: "/images/styles/egyptian-royalty.jpg" },
              { style: "Tutu Princess", image: "/images/styles/tutu-princess.jpg" },
              { style: "Tea Party Guest", image: "/images/styles/tea-party-guest.jpg" },
              { style: "Cozy Cabin", image: "/images/styles/cozy-cabin.jpg" },
            ].map((item, index) => (
              <Link key={index} href="/styles">
                <div
                  className="group relative aspect-square rounded-lg overflow-hidden border border-border/50 hover-elevate"
                  data-testid={`style-preview-${index}`}
                >
                  <img
                    src={item.image}
                    alt={item.style}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                    <span className="text-xs font-medium text-white drop-shadow-lg">{item.style}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-muted-foreground mb-4">
              Elegant portraits that showcase each pet's unique personality and charm
            </p>
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-view-all-styles" asChild>
              <Link href="/styles">
                <Palette className="h-4 w-4" />
                View All Styles
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Create beautiful portraits for your rescue organization in four simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Dog,
                title: "Upload a Photo",
                description: "Upload a clear photo of your rescue dog or cat. We work with any breed or mix!",
              },
              {
                icon: Palette,
                title: "Choose a Style",
                description: "Select from 40+ stunning artistic styles from Classical to Fun.",
              },
              {
                icon: Sparkles,
                title: "Generate Portrait",
                description: "Our AI creates a unique, beautiful portrait perfect for adoption profiles.",
              },
              {
                icon: LayoutGrid,
                title: "Build Your Showcase",
                description: "Assemble a gallery of your adoptable pets to share and attract adopters.",
              },
            ].map((step, index) => (
              <Card key={index} className="text-center hover-elevate">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-sm text-primary font-medium mb-2">Step {index + 1}</div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">Why Choose Pawtrait Pals?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built specifically for rescue organizations to showcase their adoptable pets
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Heart,
                title: "Made for Rescues",
                description: "Designed to help dogs and cats find loving homes through beautiful visual appeal",
              },
              {
                icon: Palette,
                title: "40+ Art Styles",
                description: "From Renaissance nobles to Egyptian Royalty - find the perfect personality match",
              },
              {
                icon: Building2,
                title: "Organization Galleries",
                description: "Create stunning collages of all your available rescue pets in one place",
              },
              {
                icon: Share2,
                title: "Easy Sharing",
                description: "Each pet gets a unique profile page ready to share on social media",
              },
            ].map((feature, index) => (
              <Card key={index} className="hover-elevate">
                <CardContent className="pt-6">
                  <feature.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Ready to Help Pets Find Homes?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join rescue organizations using beautiful AI portraits to showcase their adoptable dogs and cats.
          </p>
          {isAuthenticated ? (
            <Button size="lg" variant="secondary" className="gap-2" data-testid="button-start-creating" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="h-5 w-5" />
                Go to Dashboard
              </Link>
            </Button>
          ) : (
            <a href="/login">
              <Button size="lg" variant="secondary" className="gap-2" data-testid="button-start-creating">
                <Sparkles className="h-5 w-5" />
                Start Your Free Trial
              </Button>
            </a>
          )}
        </div>
      </section>

    </div>
  );
}
