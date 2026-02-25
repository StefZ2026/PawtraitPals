import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, getAuthHeaders, queryClient } from "@/lib/queryClient";
import { ImportAnimalCard } from "@/components/import-animal-card";
import {
  Dog, Cat, ArrowLeft, Search, Download, Loader2, Key, Building2, AlertTriangle
} from "lucide-react";
import type { Organization } from "@shared/schema";

type Provider = "shelterluv" | "rescuegroups";

interface NormalizedOrg {
  externalId: string;
  name: string;
  location: string | null;
  website: string | null;
}

interface NormalizedAnimal {
  externalId: string;
  name: string;
  species: "dog" | "cat";
  breed: string | null;
  age: string | null;
  description: string | null;
  photos: string[];
  adoptionUrl: string | null;
  isAvailable: boolean;
  tags: string[];
  alreadyImported: boolean;
}

export default function ImportPets() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();

  const [provider, setProvider] = useState<Provider>("shelterluv");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [shelterluvKey, setShelterluvKey] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<NormalizedOrg | null>(null);
  const [selectedAnimals, setSelectedAnimals] = useState<Set<string>>(new Set());
  const [selectedPhotos, setSelectedPhotos] = useState<Record<string, string>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<NormalizedOrg[] | null>(null);
  const [animals, setAnimals] = useState<NormalizedAnimal[] | null>(null);
  const [isLoadingAnimals, setIsLoadingAnimals] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);

  // Get admin org ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const orgIdParam = urlParams.get("org");

  const { data: myOrganization } = useQuery<Organization>({
    queryKey: ["/api/my-organization"],
    enabled: isAuthenticated && !isAdmin,
  });

  const handleSearch = async () => {
    // RescueGroups requires location (zip code); other providers require name
    if (provider === "rescuegroups" && !searchLocation.trim()) return;
    if (provider !== "rescuegroups" && !searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults(null);
    setSelectedOrg(null);
    setAnimals(null);

    try {
      const headers = await getAuthHeaders();
      const params = new URLSearchParams({ provider, name: searchQuery.trim() || "_" });
      if (searchLocation.trim()) params.set("location", searchLocation.trim());

      const res = await fetch(`/api/import/search?${params}`, { headers });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Search failed");
      }
      const orgs = await res.json();
      setSearchResults(orgs);
    } catch (error: any) {
      toast({ title: "Search failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectOrg = async (org: NormalizedOrg) => {
    setSelectedOrg(org);
    setIsLoadingAnimals(true);
    setAnimals(null);
    setSelectedAnimals(new Set());
    setSelectedPhotos({});
    setLimitError(null);

    try {
      const headers = await getAuthHeaders();
      const params = new URLSearchParams({ provider, orgId: org.externalId });
      if (orgIdParam) params.set("userOrgId", orgIdParam);

      const res = await fetch(`/api/import/animals?${params}`, { headers });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch animals");
      }
      const data = await res.json();
      setAnimals(data);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoadingAnimals(false);
    }
  };

  const handleShelterLuvFetch = async () => {
    if (!shelterluvKey.trim()) return;
    setIsLoadingAnimals(true);
    setAnimals(null);
    setSelectedAnimals(new Set());
    setSelectedPhotos({});
    setLimitError(null);

    try {
      const headers = await getAuthHeaders();
      const params = new URLSearchParams({ provider: "shelterluv", apiKey: shelterluvKey.trim() });
      if (orgIdParam) params.set("userOrgId", orgIdParam);

      const res = await fetch(`/api/import/animals?${params}`, { headers });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch animals");
      }
      const data = await res.json();
      setAnimals(data);
      setSelectedOrg({ externalId: "shelterluv", name: "Your ShelterLuv Account", location: null, website: null });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoadingAnimals(false);
    }
  };

  const toggleAnimal = (externalId: string) => {
    setSelectedAnimals((prev) => {
      const next = new Set(prev);
      if (next.has(externalId)) {
        next.delete(externalId);
      } else {
        next.add(externalId);
      }
      return next;
    });
    setLimitError(null);
  };

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!animals) throw new Error("No animals to import");

      const toImport = animals
        .filter((a) => selectedAnimals.has(a.externalId) && !a.alreadyImported)
        .map((a) => ({
          externalId: a.externalId,
          name: a.name,
          species: a.species,
          breed: a.breed,
          age: a.age,
          description: a.description,
          selectedPhotoUrl: selectedPhotos[a.externalId] || a.photos[0] || null,
          adoptionUrl: null,
          isAvailable: a.isAvailable,
          tags: a.tags,
        }));

      if (toImport.length === 0) throw new Error("No new animals selected for import");

      const body: any = { provider, animals: toImport };
      if (orgIdParam) body.orgId = parseInt(orgIdParam);

      const headers = await getAuthHeaders();
      const res = await fetch("/api/import/pets", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "pet_limit_exceeded") {
          setLimitError(data.message);
          throw new Error(data.message);
        }
        throw new Error(data.message || data.error || "Import failed");
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Import complete!",
        description: `${data.imported} pets imported${data.skipped > 0 ? `, ${data.skipped} skipped (already imported)` : ""}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-dogs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/organizations"] });
      navigate(orgIdParam ? `/dashboard?org=${orgIdParam}` : "/dashboard");
    },
    onError: (error: Error) => {
      if (!limitError) {
        toast({ title: "Import failed", description: error.message, variant: "destructive" });
      }
    },
  });

  const newAnimalsSelected = animals
    ? [...selectedAnimals].filter((id) => {
        const a = animals.find((x) => x.externalId === id);
        return a && !a.alreadyImported;
      }).length
    : 0;

  const providerTabs: { key: Provider; label: string; icon: React.ReactNode }[] = [
    { key: "shelterluv", label: "ShelterLuv", icon: <Key className="h-4 w-4" /> },
    { key: "rescuegroups", label: "RescueGroups", icon: <Cat className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-1.5 font-serif font-bold text-xl text-primary">
            <span className="flex items-center gap-0.5"><Dog className="h-5 w-5" /><Cat className="h-5 w-5" /></span>Pawtrait Pals
          </Link>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href={orgIdParam ? `/dashboard?org=${orgIdParam}` : "/dashboard"}>
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold flex items-center justify-center gap-2">
            <Download className="h-6 w-6 text-primary" />
            Import Pets
          </h1>
          <p className="text-muted-foreground mt-1">
            Pull your pets from an existing platform — no re-entering data.
          </p>
        </div>

        {/* Provider tabs */}
        <div className="flex justify-center gap-2">
          {providerTabs.map((tab) => (
            <Button
              key={tab.key}
              variant={provider === tab.key ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => {
                setProvider(tab.key);
                setSearchResults(null);
                setSelectedOrg(null);
                setAnimals(null);
                setSelectedAnimals(new Set());
                setLimitError(null);
              }}
            >
              {tab.icon} {tab.label}
            </Button>
          ))}
        </div>

        {/* Search / Connect UI */}
        {provider === "shelterluv" ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Connect ShelterLuv</CardTitle>
              <CardDescription>
                Paste your ShelterLuv API key to pull your animals directly. You can find this in your ShelterLuv admin panel under Configure &gt; Uploads and Integrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Your ShelterLuv API key"
                  value={shelterluvKey}
                  onChange={(e) => setShelterluvKey(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleShelterLuvFetch()}
                  type="password"
                />
                <Button onClick={handleShelterLuvFetch} disabled={isLoadingAnimals || !shelterluvKey.trim()} className="gap-2 shrink-0">
                  {isLoadingAnimals ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Fetch Animals
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Search RescueGroups
              </CardTitle>
              <CardDescription>
                Enter your zip code to find nearby rescue organizations, then optionally filter by name.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <Input
                  placeholder="Zip code (e.g. 30188)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-40"
                />
                <Input
                  placeholder="Organization name (optional)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 min-w-[200px]"
                />
                <Button onClick={handleSearch} disabled={isSearching || !searchLocation.trim()} className="gap-2 shrink-0">
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search results — org list */}
        {searchResults && !selectedOrg && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">
              {searchResults.length === 0 ? "No organizations found" : `Found ${searchResults.length} organization${searchResults.length !== 1 ? "s" : ""}`}
            </h2>
            {searchResults.map((org) => (
              <Card
                key={org.externalId}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSelectOrg(org)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{org.name}</p>
                    {org.location && <p className="text-sm text-muted-foreground">{org.location}</p>}
                  </div>
                  <Button variant="outline" size="sm">Select</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Loading animals */}
        {isLoadingAnimals && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        )}

        {/* Animals grid */}
        {animals && !isLoadingAnimals && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedOrg?.name} — {animals.length} animal{animals.length !== 1 ? "s" : ""}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select the pets you want to import. {animals.filter(a => a.alreadyImported).length > 0 && (
                    <span className="text-primary">{animals.filter(a => a.alreadyImported).length} already imported.</span>
                  )}
                </p>
              </div>
            </div>

            {animals.length === 0 ? (
              <Card className="py-12">
                <CardContent className="text-center">
                  <Dog className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No adoptable animals found for this organization.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {animals.map((animal) => (
                    <ImportAnimalCard
                      key={animal.externalId}
                      animal={animal}
                      selected={selectedAnimals.has(animal.externalId)}
                      onToggle={() => toggleAnimal(animal.externalId)}
                      onPhotoSelect={(url) =>
                        setSelectedPhotos((prev) => ({ ...prev, [animal.externalId]: url }))
                      }
                      selectedPhotoUrl={selectedPhotos[animal.externalId] || null}
                    />
                  ))}
                </div>

                {/* Import controls — shown when pets are selected */}
                {newAnimalsSelected > 0 && (
                  <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="p-4 space-y-4">
                      {/* Pet limit error */}
                      {limitError && (
                        <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/30">
                          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-destructive">Pet limit reached</p>
                            <p className="text-muted-foreground mt-1">{limitError}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              asChild
                            >
                              <Link href={orgIdParam ? `/dashboard?org=${orgIdParam}` : "/dashboard"}>
                                Manage Your Plan
                              </Link>
                            </Button>
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={() => importMutation.mutate()}
                        disabled={importMutation.isPending || !!limitError}
                        className="gap-2 w-full"
                        size="lg"
                      >
                        {importMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Import {newAnimalsSelected} Pet{newAnimalsSelected !== 1 ? "s" : ""}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
