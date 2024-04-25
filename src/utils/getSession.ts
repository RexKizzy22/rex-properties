import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { Session } from "next-auth";

const getSession = async (): Promise<{
  user: Session["user"];
  userId?: string;
} | null> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return null;
    }

    return {
      user: session.user,
      userId: session.user.id,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getSession;
