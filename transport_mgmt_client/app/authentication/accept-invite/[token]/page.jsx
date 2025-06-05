"use client";

import { useParams } from "next/navigation";
import AcceptInviteForm from "./_components/accept-invitation-form";

export default function AcceptInvitePage() {
  const { token } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-4 border rounded">
        <h1 className="text-xl font-bold mb-4">Accept Invite</h1>
        <AcceptInviteForm token={token} />
      </div>
    </div>
  );
}
