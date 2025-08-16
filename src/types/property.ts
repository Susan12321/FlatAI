export type PropertyImage = {
  id: number;
  propertyId: number;
  imageUrl: string;
};

export type Property = {
  id: number;
  landlordId: number;
  title: string;
  description?: string | null;
  address: string;
  city: string;
  postalCode: string;
  rent: number;
  availableFrom: Date;
  createdAt: Date;
  images?: PropertyImage[]; // optional array of images
  rating?: number; // optional if you want to display ratings
  reviews?: number; // optional
};
