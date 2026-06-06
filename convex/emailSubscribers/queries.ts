import { query } from "../_generated/server";

export const getSubscribers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const subscribers = await ctx.db.query("emailSubscribers").collect();
    return subscribers.map(sub => ({
      id: sub._id.toString(),
      firstName: sub.firstName,
      lastName: sub.lastName,
      email: sub.email,
    }));
  },
});
