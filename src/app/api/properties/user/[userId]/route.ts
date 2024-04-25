import connectDB from "@/config/database";
import Property from "@/models/Property";

// GET /api/properties/user/userId
export const GET = async (
  req: Request,
  { params }: { params: { userId: string } }
): Promise<Response> => {
  try {
    await connectDB();

    const userId = params.userId;

    if (!userId) {
      return Response.json(
        { message: "User ID is required" },
        {
          status: 400,
        }
      );
    }

    const properties = await Property.find({ owner: userId }).lean().exec();

    return Response.json(properties);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: (error as Error).message },
      {
        status: 500,
      }
    );
  }
};
