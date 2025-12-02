import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

function ForbiddenPage() {
    return (
        <div className="flex items-center justify-center h-screen w-full bg-white absolute top-0 left-0 z-50">
            <div className="px-3 flex flex-col items-center justify-center my-auto space-y-8">
                <Image src="/logo.png" alt="Infynno" width={250} height={120} />
                <div className="space-y-1">
                    <div className="flex items-center justify-center">
                        <UserButton afterSignOutUrl="/sign-in" signInUrl="/sign-in" appearance={{
                            variables: {
                                fontSize: "0.9rem",
                            },
                        }} />
                    </div>
                    <h1 className="text-2xl font-bold text-center text-gray-800">
                        Unauthorized Access
                    </h1>
                    <h1 className="text-md my-3 text-center text-gray-800">
                        You are not authorized to access this page.
                    </h1>
                    <p className="text-center text-gray-600 mt-3">
                        Please contact the administrator to get access.
                    </p>
                </div>
            </div>

        </div>
    );
}
export default ForbiddenPage;
