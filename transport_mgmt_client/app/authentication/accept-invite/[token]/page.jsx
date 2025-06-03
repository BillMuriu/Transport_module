"use client";

import { useParams } from "next/navigation";
import AcceptInviteForm from "./_components/accept-invitation-form";

export default function AcceptInvitePage() {
  const { token } = useParams();

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">Accept Invite</h1>
      <AcceptInviteForm token={token} />
    </div>
  );
}
