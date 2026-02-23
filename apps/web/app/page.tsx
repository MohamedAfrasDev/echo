"use client";
import { useMutation, useQuery, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { SignInButton, UserButton } from "@clerk/nextjs";
/**
 * Render the page that shows authenticated user controls and a list of users, or a sign-in prompt when unauthenticated.
 *
 * The authenticated view includes a user account button, an "Add User" button that triggers a user-add mutation, and a list of users. The unauthenticated view shows a message and a sign-in button.
 *
 * @returns The React element for the page UI.
 */
export default function Page() {

  const users = useQuery(api.users.getMany);
  const addUsers = useMutation(api.users.add);
  return (
    <>
      <Authenticated>
        <div className="flex items-center justify-center min-h-svh">
          <UserButton />
          <button onClick={() => addUsers({})}>Add User</button>
          {users?.map((user) => (
            <p key={user._id}>{user.name}</p>
          ))}
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="flex items-center justify-center min-h-svh">
          <p>Please sign in to continue</p>
          <SignInButton />
        </div>
      </Unauthenticated>
    </>
  )
}
