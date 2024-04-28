"use clinet";

import useSWR from "swr";
import { toast } from "react-toastify";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";

const BookmarkedProperties = () => {
  const fetcher = (...args: any[]) =>
    fetch(...(args as [string, any])).then((res) => res.json());

  const {
    data: properties,
    isLoading,
    error,
  } = useSWR("/api/bookmarks", fetcher);

  if (error) {
    toast.error("Failed to fetch bookmarked properties");
    console.error(error.message);
    return;
  }

  return isLoading ? (
    <Spinner loading={isLoading} />
  ) : (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
          Recent Properties
        </h2>
        {properties?.length === 0 ? (
          <p>No property found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties?.map((property: any) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookmarkedProperties;
