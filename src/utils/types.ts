type BaseProperty = {
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
    nightly?: number | string;
    weekly?: number | string;
    monthly?: number | string;
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
  _id? : string;
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
