import { NextResponse } from "next/server";

export function middleware(request) {
  // Debug logging - remove after testing
  console.log("All cookies:", request.cookies.getAll());
  console.log("User Agent:", request.headers.get("user-agent"));

  const authCookie = request.cookies.get("auth")?.value;
  const userType = request.cookies.get("user_type")?.value; // Changed from "role" to "user_type"

  console.log("Auth cookie:", authCookie);
  console.log("User type cookie:", userType);

  const pathname = request.nextUrl.pathname;

  const isSchoolAdminRoute = pathname.startsWith("/school_admin");
  const isTripTeacherRoute = pathname.startsWith("/trip_teacher");

  // Redirect if unauthenticated
  if ((isSchoolAdminRoute || isTripTeacherRoute) && authCookie !== "true") {
    const loginUrl = new URL("/authentication/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check user type access - Updated to use userType instead of role
  if (isSchoolAdminRoute && userType !== "SCHOOL_ADMIN") {
    return NextResponse.redirect(
      new URL("/authentication/unauthorized/trip-coordinator", request.url)
    );
  }

  if (isTripTeacherRoute && userType !== "TRIP_TEACHER") {
    return NextResponse.redirect(
      new URL("/authentication/unauthorized/school-admin", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/school_admin/:path*", "/trip_teacher/:path*"],
};
