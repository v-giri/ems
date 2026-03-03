import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    documentUploader: f({ pdf: { maxFileSize: "4MB" }, text: { maxFileSize: "4MB" }, image: { maxFileSize: "4MB" } })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const session = await getServerSession(authOptions);

            // If you throw, the user will not be able to upload
            if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { uploaderId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.uploaderId);

            console.log("file url", file.url);

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.uploaderId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
