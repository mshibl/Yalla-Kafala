import { query } from "../_generated/server";
import { v } from "convex/values";
import type { BoardMember } from "../../src/lib/types";

export const getBoardMembers = query({
  args: {
    publishedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<BoardMember[]> => {
    let boardMembers = await ctx.db.query("boardMembers").collect();
    if (args.publishedOnly) {
      boardMembers = boardMembers.filter((member) => member.publish);
    }
    return boardMembers.map((boardMember) => ({
      id: boardMember._id.toString(),
      ...boardMember,
    }));
  },
});
