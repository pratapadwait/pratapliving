import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertPropertySchema, type InsertProperty, type Property } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Bed, Bath, Users, ImagePlus, Link2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { z } from "zod";
import { ImageUploadManager } from "@/components/image-upload-manager";
import { OptimizedImage } from "@/components/optimized-image";

const AMENITY_OPTIONS = [
  "Wifi",
  "Extra Mattress",
  "Balcony",
  "Kitchen-access",
  "Round-the-clock cleaning service",
  "Geyser",
  "Iron",
  "Air conditioning",
  "Kettle",
  "TV",
  "Microwave",
  "Dedicated workspace",
  "Body soap",
] as const;

const PROPERTY_TYPES = ["homestay", "suite", "apartment", "villa"] as const;

const propertyFormSchema = insertPropertySchema.extend({
  type: z.array(z.string()).min(1, "Select at least one property type"),
  amenities: z.array(z.string()).min(1, "Select at least one amenity"),
}).omit({ imageUrl: true, images: true, type: true }).extend({
  type: z.array(z.string()).min(1, "Select at least one property type"),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

function PropertyFormDialog({
  open,
  onOpenChange,
  property,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property;
}) {
  const { toast } = useToast();
  const isEditing = !!property;

  const isValidImagePath = (url: string | null | undefined): boolean => {
    if (!url) return false;
    return url.startsWith("/objects/") || url.startsWith("http");
  };

  const getInitialImages = (): string[] => {
    if (!property) return [];
    const imgs: string[] = [];
    if (isValidImagePath(property.imageUrl)) imgs.push(property.imageUrl!);
    if (property.images) {
      for (const img of property.images) {
        if (img && !imgs.includes(img)) imgs.push(img);
      }
    }
    return imgs;
  };

  const [uploadedImages, setUploadedImages] = useState<string[]>(getInitialImages);

  useEffect(() => {
    setUploadedImages(getInitialImages());
  }, [property, open]);

  const [externalImageUrl, setExternalImageUrl] = useState("");

  const parseTypes = (type: string | string[] | undefined): string[] => {
    if (!type) return [];
    if (Array.isArray(type)) return type;
    return type.split(",").map(t => t.trim()).filter(Boolean);
  };

  const getDefaultValues = (): PropertyFormValues => ({
    name: property?.name ?? "",
    type: parseTypes(property?.type),
    location: property?.location ?? "",
    description: property?.description ?? "",
    price: property?.price ?? 0,
    bedrooms: property?.bedrooms ?? 1,
    bathrooms: property?.bathrooms ?? 1,
    guests: property?.guests ?? 2,
    amenities: property?.amenities ?? [],
    featured: property?.featured ?? false,
  });

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
  }, [property, open]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      return apiRequest("POST", "/api/properties", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({ title: "Property added successfully!" });
      onOpenChange(false);
      form.reset();
      setUploadedImages([]);
    },
    onError: () => {
      toast({ title: "Failed to add property", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      return apiRequest("PUT", `/api/properties/${property!.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({ title: "Property updated successfully!" });
      onOpenChange(false);
    },
    onError: () => {
      toast({ title: "Failed to update property", variant: "destructive" });
    },
  });

  const onSubmit = (data: PropertyFormValues) => {
    if (uploadedImages.length === 0) {
      toast({ title: "Please upload at least one image", variant: "destructive" });
      return;
    }

    const payload: InsertProperty = {
      ...data,
      type: (data.type as string[]).join(","),
      amenities: data.amenities,
      imageUrl: uploadedImages[0],
      images: uploadedImages.slice(1),
    };

    if (isEditing) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {isEditing ? "Edit Property" : "Add New Property"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Royal Heritage Suite" {...field} data-testid="input-property-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={() => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <div className="flex flex-wrap gap-4 mt-1">
                    {PROPERTY_TYPES.map((pType) => (
                      <FormField
                        key={pType}
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={(field.value as string[])?.includes(pType)}
                                onCheckedChange={(checked) => {
                                  const current = (field.value as string[]) || [];
                                  if (checked) {
                                    field.onChange([...current, pType]);
                                  } else {
                                    field.onChange(current.filter((v: string) => v !== pType));
                                  }
                                }}
                                data-testid={`checkbox-type-${pType}`}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal !mt-0 cursor-pointer capitalize">
                              {pType}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Hazratganj, Lucknow" {...field} data-testid="input-property-location" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the property..."
                      rows={3}
                      {...field}
                      data-testid="textarea-property-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (per night)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="3500"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-property-price"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        data-testid="input-property-bedrooms"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        data-testid="input-property-bathrooms"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Guests</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        data-testid="input-property-guests"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="amenities"
              render={() => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {AMENITY_OPTIONS.map((amenity) => (
                      <FormField
                        key={amenity}
                        control={form.control}
                        name="amenities"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={(field.value as string[])?.includes(amenity)}
                                onCheckedChange={(checked) => {
                                  const current = (field.value as string[]) || [];
                                  if (checked) {
                                    field.onChange([...current, amenity]);
                                  } else {
                                    field.onChange(current.filter((v: string) => v !== amenity));
                                  }
                                }}
                                data-testid={`checkbox-amenity-${amenity.toLowerCase().replace(/\s+/g, "-")}`}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal !mt-0 cursor-pointer">
                              {amenity}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="text-sm font-medium leading-none">Property Photos</label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                Upload images or add external image links. The first image will be the main photo shown on listing cards.
              </p>
              <ImageUploadManager
                images={uploadedImages}
                onChange={setUploadedImages}
                maxImages={20}
                folder={`/pratapliving-com/${(form.watch("name") || "unnamed").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
              />
              <div className="mt-3">
                <label className="text-xs font-medium text-muted-foreground">Add image via external link</label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="https://ik.imagekit.io/..."
                    value={externalImageUrl}
                    onChange={(e) => setExternalImageUrl(e.target.value)}
                    data-testid="input-external-image-url"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const url = externalImageUrl.trim();
                      if (!url) return;
                      if (!url.startsWith("http")) {
                        toast({ title: "Please enter a valid URL starting with http", variant: "destructive" });
                        return;
                      }
                      if (uploadedImages.includes(url)) {
                        toast({ title: "This image is already added", variant: "destructive" });
                        return;
                      }
                      setUploadedImages([...uploadedImages, url]);
                      setExternalImageUrl("");
                    }}
                    data-testid="button-add-external-image"
                  >
                    <Link2 className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      data-testid="switch-property-featured"
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Featured Property</FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-property">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} data-testid="button-save-property">
                {isPending ? "Saving..." : isEditing ? "Update Property" : "Add Property"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminProperties() {
  useDocumentTitle("Property Management | Pratap Living CMS");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({ title: "Property deleted successfully" });
      setDeleteConfirmId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete property", variant: "destructive" });
    },
  });

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingProperty(undefined);
    setIsDialogOpen(true);
  };

  const getDisplayImage = (property: Property): string | null => {
    const isValid = (url: string | null | undefined) =>
      url && (url.startsWith("/objects/") || url.startsWith("http"));
    if (isValid(property.imageUrl)) return property.imageUrl;
    if (property.images) {
      const first = property.images.find(img => isValid(img));
      if (first) return first;
    }
    return null;
  };

  const typeLabels: Record<string, string> = {
    homestay: "Homestay",
    suite: "Suite",
    apartment: "Apartment",
    villa: "Villa",
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="text-cms-title">
                Property Management
              </h1>
              <p className="text-muted-foreground">
                Add, edit, and manage your property listings
              </p>
            </div>
            <Button onClick={handleAdd} data-testid="button-add-property">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <div className="h-48 bg-muted animate-pulse rounded-t-md" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-muted animate-pulse rounded-md w-3/4" />
                      <div className="h-4 bg-muted animate-pulse rounded-md w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-muted-foreground mb-4">No properties listed yet</p>
                <Button onClick={handleAdd} data-testid="button-add-first-property">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Property
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="hidden lg:block">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((property) => (
                        <TableRow key={property.id} data-testid={`row-property-${property.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {getDisplayImage(property) ? (
                                <OptimizedImage
                                  src={getDisplayImage(property)!}
                                  alt={property.name}
                                  className="h-12 w-16 rounded-md"
                                  loading="eager"
                                  data-testid={`img-thumbnail-${property.id}`}
                                />
                              ) : (
                                <div className="h-12 w-16 bg-muted rounded-md flex items-center justify-center">
                                  <ImagePlus className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                              <span className="font-medium text-sm">{property.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {property.type.split(",").map(t => t.trim()).filter(Boolean).map((t) => (
                                <Badge key={t} variant="secondary">
                                  {typeLabels[t] || t}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{property.location}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {property.bedrooms}</span>
                              <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {property.bathrooms}</span>
                              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {property.guests}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-sm">&#8377;{property.price.toLocaleString()}</TableCell>
                          <TableCell>
                            {property.featured && (
                              <Badge variant="default" className="text-xs">Featured</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button size="icon" variant="ghost" onClick={() => handleEdit(property)} data-testid={`button-edit-${property.id}`}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => setDeleteConfirmId(property.id)} data-testid={`button-delete-${property.id}`}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>

              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                {properties.map((property) => (
                  <Card key={property.id} data-testid={`card-property-${property.id}`}>
                    <CardContent className="p-0">
                      {getDisplayImage(property) ? (
                        <OptimizedImage
                          src={getDisplayImage(property)!}
                          alt={property.name}
                          className="w-full h-40 rounded-t-md"
                          data-testid={`img-card-${property.id}`}
                        />
                      ) : (
                        <div className="w-full h-40 bg-muted rounded-t-md flex items-center justify-center">
                          <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-sm">{property.name}</h3>
                          <div className="flex flex-wrap gap-1 shrink-0">
                            {property.type.split(",").map(t => t.trim()).filter(Boolean).map((t) => (
                              <Badge key={t} variant="secondary" className="text-xs">
                                {typeLabels[t] || t}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-xs mb-2">{property.location}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {property.bedrooms}</span>
                          <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {property.bathrooms}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {property.guests}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm">&#8377;{property.price.toLocaleString()}/night</span>
                          <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => handleEdit(property)} data-testid={`button-edit-mobile-${property.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => setDeleteConfirmId(property.id)} data-testid={`button-delete-mobile-${property.id}`}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />

      <PropertyFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingProperty(undefined);
        }}
        property={editingProperty}
      />

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete this property? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
