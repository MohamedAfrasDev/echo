"use client";
import { useQuery } from "convex/react"
import { api } from "@workspace/backend/convex/_generated/api"
export default function Page() {

  const users = useQuery(api.users.getMany);
  return (
    <div className="flex items-center justify-center min-h-svh">
      <p>apps/weasskigsdfidwufy</p>
      {users?.map((user) => (
        <p key={user._id}>{user.name}</p>
      ))}
    </div>
  )
}
