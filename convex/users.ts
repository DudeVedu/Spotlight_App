import { v } from "convex/values";
import { mutation, MutationCtx, QueryCtx } from "./_generated/server";

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

export async function getAuthenticatedUser(ctx:QueryCtx | MutationCtx){
            const identity = await ctx.auth.getUserIdentity();//Comes frm convex integration with clerk, return null or identity object
        //inside identity
//         {
//   "subject": "user_2cX1yZAbCz9N8sd93kFh123",
//   "tokenIdentifier": "https://example.clerk.accounts.dev",
//   "email": "alice@example.com",
//   "name": "Alice"
// }

        if(!identity) throw new Error("Unatuhorized");

        const currentUser = await ctx.db.
            query("users").
            withIndex("by_clerk_id", (q) => q.eq("clerkId",identity.subject)).
            first()

            if(! currentUser) throw new Error("User not found");// This is imp, coz typescript dosent know id currentUser is not null
            return currentUser;
        }