import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dog, Cat, Check } from "lucide-react";

interface ImportAnimalCardProps {
  animal: {
    externalId: string;
    name: string;
    species: "dog" | "cat";
    breed: string | null;
    age: string | null;
    description: string | null;
    photos: string[];
    tags: string[];
    alreadyImported: boolean;
  };
  selected: boolean;
  onToggle: () => void;
  onPhotoSelect: (url: string) => void;
  selectedPhotoUrl: string | null;
}

export function ImportAnimalCard({
  animal,
  selected,
  onToggle,
  onPhotoSelect,
  selectedPhotoUrl,
}: ImportAnimalCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const currentPhoto = selectedPhotoUrl || animal.photos[photoIndex] || null;
  const hasMultiplePhotos = animal.photos.length > 1;

  const handlePhotoClick = (idx: number) => {
    setPhotoIndex(idx);
    onPhotoSelect(animal.photos[idx]);
  };

  if (animal.alreadyImported) {
    return (
      <Card className="overflow-hidden opacity-60">
        <div className="aspect-square relative bg-muted">
          {currentPhoto ? (
            <img src={currentPhoto} alt={animal.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {animal.species === "cat" ? <Cat className="h-12 w-12 text-muted-foreground/30" /> : <Dog className="h-12 w-12 text-muted-foreground/30" />}
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="secondary" className="gap-1">
              <Check className="h-3 w-3" /> Already Imported
            </Badge>
          </div>
          <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/60 to-transparent">
            <h3 className="font-serif font-bold text-white text-sm">{animal.name}</h3>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all ${
        selected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
      }`}
      onClick={onToggle}
    >
      <div className="aspect-square relative bg-muted">
        {currentPhoto ? (
          <img src={currentPhoto} alt={animal.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {animal.species === "cat" ? <Cat className="h-12 w-12 text-muted-foreground/30" /> : <Dog className="h-12 w-12 text-muted-foreground/30" />}
          </div>
        )}

        {/* Selection indicator */}
        <div className={`absolute top-2 right-2 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected ? "bg-primary border-primary" : "bg-white/80 border-gray-300"
        }`}>
          {selected && <Check className="h-4 w-4 text-white" />}
        </div>

        {/* Name overlay */}
        <div className="absolute top-0 left-0 right-8 p-2 bg-gradient-to-b from-black/60 to-transparent">
          <h3 className="font-serif font-bold text-white text-sm">{animal.name}</h3>
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        <p className="text-xs text-muted-foreground truncate">
          {animal.breed}{animal.age ? ` • ${animal.age}` : ""}
        </p>

        {/* Photo picker thumbnails */}
        {hasMultiplePhotos && selected && (
          <div className="flex gap-1 overflow-x-auto pb-1" onClick={(e) => e.stopPropagation()}>
            {animal.photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => handlePhotoClick(idx)}
                className={`flex-shrink-0 h-10 w-10 rounded border-2 overflow-hidden transition-colors ${
                  (selectedPhotoUrl === photo || (!selectedPhotoUrl && idx === photoIndex))
                    ? "border-primary"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Tags */}
        {animal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {animal.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
            {animal.tags.length > 4 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                +{animal.tags.length - 4}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
