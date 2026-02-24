"use client";
import { useMutation, useQuery, Authenticated, Unauthenticated } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
export default function Page() {

    const addUsers = useMutation(api.users.add);
    return (
        <>
            <Authenticated>
                <div className="flex items-center justify-center min-h-svh">

                    <button onClick={() => addUsers({})}>Add User</button>

                </div>
            </Authenticated>
            <Unauthenticated>
                <div className="flex items-center justify-center min-h-svh">
                    <p>Please sign in to continue</p>

                </div>
            </Unauthenticated>
        </>
    )
}
