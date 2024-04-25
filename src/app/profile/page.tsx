"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import profileDefault from "@/assets/images/profile.png";
import useSWR from "swr";
import Spinner from "@/components/Spinner";
import { SavedProperty } from "@/utils/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;
  const profileName = session?.user?.name;
  const profileEmail = session?.user?.email;
  const userId = session?.user?.id;

  const [properties, setProperties] = useState([]);

  const fetcher = (...args: any[]) =>
    fetch(...(args as [string, any])).then((res) => res.json());

  const { data, isLoading, error } = useSWR(
    `/api/properties/user/${userId}`,
    fetcher
  );

  useEffect(() => {
    data && setProperties(data);
  }, [data]); 

  const handleDeleteProperty = async (propertyId: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this property"
    );

    if (!confirm) return;

    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        const updatedProperties = properties.filter(
          (propertyItem: SavedProperty) => propertyItem._id !== propertyId
        );

        setProperties(updatedProperties);

        toast.success("Property has been deleted");
      } else {
        toast.error("Failed to delete property");
      }
    } catch (error) {
      console.error((error as Error).message);
      toast.error("Failed to delete property");
    }
  };

  error && console.error(error);

  return (
    <section className="bg-blue-50">
      <div className="container m-auto py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 mx-20 mt-10">
              <div className="mb-4">
                <Image
                  height={500}
                  width={500}
                  priority={true}
                  className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0"
                  src={profileImage || profileDefault}
                  alt="User"
                />
              </div>
              <h2 className="text-2xl mb-4">
                <span className="font-bold block">Name: </span> {profileName}
              </h2>
              <h2 className="text-2xl">
                <span className="font-bold block">Email: </span> {profileEmail}
              </h2>
            </div>

            <div className="md:w-3/4 md:pl-4">
              <h2 className="text-xl font-semibold mb-4">Your Listings</h2>

              {!isLoading && properties?.length === 0 && (
                <p>You have no property listings</p>
              )}

              {isLoading ? (
                <Spinner loading={isLoading} />
              ) : (
                properties.length && properties?.map((property: SavedProperty) => {
                  return (
                    <div key={property._id} className="mb-10">
                      <a href="/property.html">
                        <Image
                          height={500}
                          width={500}
                          priority={true}
                          className="h-32 w-full rounded-md object-cover"
                          src="/images/properties/a1.jpg"
                          alt="Property 1"
                        />
                      </a>
                      <div className="mt-2">
                        <p className="text-lg font-semibold">{property.name}</p>
                        <p className="text-gray-600">
                          Address: {property.location.street}{" "}
                          {property.location.city} {property.location.state}
                        </p>
                      </div>
                      <div className="mt-2">
                        <a
                          href={`/properties/${property._id}/edit`}
                          className="bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600"
                        >
                          Edit
                        </a>
                        <button
                          className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                          type="button"
                          onClick={() =>
                            handleDeleteProperty(property?._id as string)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
