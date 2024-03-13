import connectDB from "@/config/database";
import Property from "@/models/Property";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> => {
  try {
    await connectDB();

    const property = await Property.findById(params.id).lean().exec();

    if (!property) return Response.json("Property Not Found", { status: 404 });

    return Response.json(JSON.stringify(property));
  } catch (error) {
    console.error(error);
    return Response.json(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
};
