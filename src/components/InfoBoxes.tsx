import InfoBox from "@/components/InfoBox";

const InfoBoxes = () => {
  return (
    <section>
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
          <InfoBox
            backgroundColor="bg-gray-100"
            buttonInfo={{
              text: "Browse Properties",
              backgroundColor: "bg-black",
              link: "/properties",
            }}
            heading="For Renters"
          >
            Find your dream rental property. Bookmark properties and contact
            owners.
          </InfoBox>
          <InfoBox
            backgroundColor="bg-blue-100"
            buttonInfo={{
              text: "For Property Owners",
              backgroundColor: "bg-blue-500",
              link: "/property/add",
            }}
            heading="For Renters"
          >
            List your properties and reach potential tenants. Rent as an airbnb
            or long term.
          </InfoBox>
        </div>
      </div>
    </section>
  );
};

export default InfoBoxes;
