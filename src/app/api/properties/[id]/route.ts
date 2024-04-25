import connectDB from "@/config/database";
import Property from "@/models/Property";
import getSession from "@/utils/getSession";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> => {
  try {
    await connectDB();

    const property = await Property.findById(params.id).lean().exec();

    if (!property) return Response.json("Property Not Found", { status: 404 });

    return Response.json(property);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Something went wrong" },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> => {
  try {
    await connectDB();

    const propertyId = params.id;

    const session = await getSession();

    if (!session || !session.user) {
      return Response.json("User not authenticated", { status: 401 });
    }

    const { id } = session.user;

    const property = await Property.findById(propertyId);

    if (!property) return Response.json("Property Not Found", { status: 404 });

    if (property?.owner.toString() !== id) {
      return Response.json("Forbidden property access", { status: 403 });
    }

    await property.deleteOne();

    return Response.json("Property successfully deleted", { status: 203 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Something went wrong" },
      {
        status: 500,
      }
    );
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> => {
  try {
    await connectDB();

    const { id } = params;
    const session = await getSession();

    if (!session || !session.userId) {
      return Response.json(
        { message: "UNAUTHORIZED - User ID is required" },
        { status: 401 }
      );
    }

    const userId = session?.userId;
    const formData = await req.formData();
    const amenities = formData.getAll("amenities");

    const existingProperty = await Property.findById(id);

    if (!existingProperty) {
      return Response.json(
        { message: `NOT FOUND - Property with [id]-${id} not does exist` },
        { status: 404 }
      );
    }

    if (existingProperty.owner.toString() !== userId) {
      return Response.json({ message: "UNAUTHORIZED" }, { status: 401 });
    }

    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        street: formData.get("location.street"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      amenities,
      rates: {
        weekly: formData.get("rates.weekly"),
        monthly: formData.get("rates.monthly"),
        nightly: formData.get("rates.nightly"),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
    };

    const updatedProperty = await Property.findByIdAndUpdate(id, propertyData);

    return Response.json(updatedProperty, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to add property" },
      { status: 500 }
    );
  }
};
