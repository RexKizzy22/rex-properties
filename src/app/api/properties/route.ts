import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import getSession from "@/utils/getSession";

export const GET = async (req: Request): Promise<Response> => {
  try {
    await connectDB();

    const properties = await Property.find({}).lean().exec();

    return Response.json(JSON.stringify(properties));
  } catch (error) {
    console.error(error);
    return Response.json(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
};

export const POST = async (req: Request): Promise<Response> => {
  try {
    await connectDB();

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
    const images = formData
      .getAll("images")
      .filter((image: any) => image?.name !== "") as File[];

    const imageUploadPromises = [];

    for (const image of images) {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);

      const imageBase64 = imageData.toString("base64");

      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        { folder: "rex-properties" }
      );

      imageUploadPromises.push(result.secure_url);
    }

    const uploadedImages = await Promise.all(imageUploadPromises);

    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        city: formData.get("city"),
        state: formData.get("state"),
        street: formData.get("street"),
        zipcode: formData.get("zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      amenities,
      images: uploadedImages,
      rates: {
        weekly: formData.get("weekly"),
        monthly: formData.get("monthly"),
        nightly: formData.get("nightly"),
      },
      seller_info: {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
      },
      owner: userId,
    };

    const newProperty = new Property(propertyData);
    newProperty.save();

    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
    );

    // return Response.json({ message: "Successfully added a property" });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to add property" },
      { status: 500 }
    );
  }
};
