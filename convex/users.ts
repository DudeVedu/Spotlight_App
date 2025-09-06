import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Create a new task with the given text
export const createUser = mutation({
    args:{
    username: v.string(), //johndoe
    fullname: v.string(), // John Doe
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.string(),
    clerkId: v.string(),
    },

    handler: async(ctx , args) => { // ctx means context , we will be able to accesss the databse and check authenti
    // args is the arguments we pass from above
    const existingUser =await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId",args.clerkId))
        .first();

        if(existingUser) return 
        await ctx.db.insert("users",{
            username: args.username,
            fullname: args.fullname,
            email: args.email,
            bio: args.bio,
            image: args.image,
            clerkId: args.clerkId,
            followers: 0,
            following: 0,
            posts: 0,
        })
    } 
});