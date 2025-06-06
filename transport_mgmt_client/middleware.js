import { NextResponse } from "next/server";

export function middleware(request) {
  const authCookie = request.cookies.get("auth")?.value;
  const role = request.cookies.get("role")?.value;

  const pathname = request.nextUrl.pathname;

  const isSchoolAdminRoute = pathname.startsWith("/school_admin");
  const isTripTeacherRoute = pathname.startsWith("/trip_teacher");

  // Redirect if unauthenticated
  if ((isSchoolAdminRoute || isTripTeacherRoute) && authCookie !== "true") {
    const loginUrl = new URL("/authentication/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check user type access
  if (isSchoolAdminRoute && role !== "SCHOOL_ADMIN") {
    return NextResponse.redirect(
      new URL("/authentication/unauthorized/trip-coordinator", request.url)
    );
  }

  if (isTripTeacherRoute && role !== "TRIP_TEACHER") {
    return NextResponse.redirect(
      new URL("/authentication/unauthorized/school-admin", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/school_admin/:path*", "/trip_teacher/:path*"],
};
