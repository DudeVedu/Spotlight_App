import { v } from "convex/values";
import { mutation } from "./_generated/server";


export const generateUploadUrl = mutation(async(ctx) =>{
    const identity = ctx.auth.getUserIdentity();
    if(!identity) throw new Error("Unatuhorized");// checking if user is authorized
    return await ctx.storage.generateUploadUrl();
});


export const createPost = mutation({
    args:{
        caption : v.optional(v.string()),
        storageId: v.id("_storage"),
    },

    handler: async(ctx ,args) => {
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

            const imageUrl = await ctx.storage.getUrl(args.storageId);
            if(!imageUrl) throw new Error("Image not found")


            // Create post
            const postId = await ctx.db.insert("posts", {
                userId: currentUser._id,
                imageUrl,
                storageId: args.storageId,
                caption: args.caption,
                likes: 0,
                comments: 0
            })


            // Increment post count
            await ctx.db.patch(currentUser._id, {posts : currentUser.posts +1})
    
            return postId;
        }
})