import connectDB from "@/config/database";
import User from "@/models/User";
import Property from "@/models/Property";
import getSession from "@/utils/getSession";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return Response.json("User ID is required", { status: 401 });
    }

    const { userId } = session;
    const user = await User.findOne({ _id: userId });
    const bookmarks = await Property.find({ _id: { $in: user.bookmarks } });

    return Response.json(bookmarks, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("Something went wrong", { status: 500 });
  }
};

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

    let message;

    if (isBookmarked) {
      user.bookmarks.pull(propertyId);
      message = "Bookmark successfully removed";
      isBookmarked = false;
    } else {
      user.bookmarks.push(propertyId);
      message = "Bookmark successfully added";
      isBookmarked = true;
    }

    await user.save();

    return Response.json({ message, isBookmarked }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("Something went wrong", { status: 500 });
  }
};
