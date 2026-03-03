import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const { token } = req.nextauth;

        if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/employee", req.url));
        }

        if (pathname.startsWith("/employee") && token?.role !== "EMPLOYEE" && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/employee/:path*"],
};
