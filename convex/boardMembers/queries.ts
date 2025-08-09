import { query } from "../_generated/server";
import type { BoardMember } from "../../src/lib/types";

export const getBoardMembers = query({
  handler: async (ctx): Promise<BoardMember[]> => {
    const boardMembers = await ctx.db.query("boardMembers").collect();
    return boardMembers.map((boardMember) => ({
      id: boardMember._id.toString(),
      ...boardMember,
    }));
  },
});
