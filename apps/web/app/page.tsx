"use client";
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/backend/convex/_generated/api"
export default function Page() {

  const users = useQuery(api.users.getMany);
  const addUsers = useMutation(api.users.add);
  return (
    <div className="flex items-center justify-center min-h-svh">
      <button onClick={() => addUsers({})}>Add User</button>
      {users?.map((user) => (
        <p key={user._id}>{user.name}</p>
      ))}
    </div>
  )
}
