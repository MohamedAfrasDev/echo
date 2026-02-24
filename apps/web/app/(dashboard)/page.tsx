"use client";
import { useMutation, useQuery, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { OrganizationSwitcher, SignInButton, UserButton } from "@clerk/nextjs";
export default function Page() {

    const users = useQuery(api.users.getMany);
    const addUsers = useMutation(api.users.add);
    return (
        <>
            <Authenticated>
                <div className="flex items-center justify-center min-h-svh">
                    <UserButton />
                    <OrganizationSwitcher />
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
