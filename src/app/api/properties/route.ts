import connectDB from "@/config/database";
import Property from "@/models/Property";

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
