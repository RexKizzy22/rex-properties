type BaseProperty = {
  _id?: string;
  owner: string;
  name: string;
  type: string;
  description?: string;
  location: {
    street?: string;
    city?: string;
    state?: string;
    zipcode?: string;
  };
  beds: number;
  baths: number;
  square_feet: number;
  amenities: string[];
  rates: {
    nightly?: number;
    weekly?: number;
    monthly?: number;
  };
  seller_info: {
    name?: string;
    email?: string;
    phone?: string;
  };
  is_featured: boolean;
};

export type Property = BaseProperty & { images: File[] };

export type SavedProperty = BaseProperty & {
  images: string[];
  createdAt: string;
  updatedAt: string;
};

export type AppUser = {
  id?: string;
  email: string;
  username: string;
  bookmarks?: Property;
};
