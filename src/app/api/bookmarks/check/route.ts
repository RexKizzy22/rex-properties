import connectDB from "@/config/database";
import User from "@/models/User";
import getSession from "@/utils/getSession";

export const dynamic = "force-dynamic";

export const POST = async (request: Request) => {
  try {
    await connectDB();

    const { propertyId } = await request.json();
    const session = await getSession();

    if (!session || !session.userId) {
      return Response.json("User ID is required", { status: 401 });
    }

    const { userId } = session;

    const user = await User.findOne({ _id: userId });

    let isBookmarked = user.bookmarks.includes(propertyId);

    return Response.json({ isBookmarked }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("Something went wrong", { status: 500 });
  }
};
