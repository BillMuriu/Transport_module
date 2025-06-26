"use client";

import { useParams } from "next/navigation";
import AcceptInviteForm from "./_components/accept-invitation-form";
import SchoolAdminInviteForm from "./_components/school-admin-invite-form";
import { useGetInvitation } from "./services/queries";

export default function AcceptInvitePage() {
  const { token } = useParams();
  const { data, isLoading, error } = useGetInvitation(token);

  // Extract the first invitation from results
  const invitation = data?.results?.[0];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-lg">Loading invitation details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md p-4 border rounded bg-destructive/10 text-destructive">
          <h1 className="text-xl font-bold mb-2">Error</h1>
          <p>
            Failed to load invitation details. The link may be invalid or
            expired.
          </p>
        </div>
      </div>
    );
  }

  // Check if invitation exists and is not used
  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md p-4 border rounded bg-destructive/10 text-destructive">
          <h1 className="text-xl font-bold mb-2">Invalid Invitation</h1>
          <p>This invitation link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  if (invitation.is_used) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md p-4 border rounded bg-destructive/10 text-destructive">
          <h1 className="text-xl font-bold mb-2">Invitation Already Used</h1>
          <p>This invitation has already been used to create an account.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl p-4 border rounded">
        <h1 className="text-xl font-bold mb-4">Accept Invitation</h1>

        {/* Invitation Type Information */}
        <div className="mb-6 p-4 bg-muted rounded">
          <h2 className="text-sm font-semibold mb-2">Invitation Details</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Role:</span>{" "}
              {invitation.user_type.replace("_", " ").toLowerCase()}
            </p>
            {invitation.school_name && (
              <p>
                <span className="font-medium">School:</span>{" "}
                {invitation.school_name}
              </p>
            )}
            <p>
              <span className="font-medium">Created:</span>{" "}
              {new Date(invitation.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Conditional Form Rendering */}
        {invitation.user_type === "SCHOOL_ADMIN" && !invitation.school_id ? (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 text-blue-700 rounded">
              <p>
                You are being invited as a School Administrator. Please provide
                both your account details and school information.
              </p>
            </div>
            <SchoolAdminInviteForm token={token} invitation={invitation} />
          </div>
        ) : (
          <div className="space-y-6">
            {invitation.school_id && (
              <div className="p-4 bg-blue-50 text-blue-700 rounded">
                <p>
                  You are being invited as an Administrator for{" "}
                  {invitation.school_name}.
                </p>
              </div>
            )}
            <AcceptInviteForm token={token} invitation={invitation} />
          </div>
        )}
      </div>
    </div>
  );
}
