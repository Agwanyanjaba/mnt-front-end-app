import SignInButton from "@/components/shared/Navigation/Navbar/UserOptions/SignInButton";

const SignInModal = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 sm:p-10 rounded-lg shadow-lg text-center w-11/12 sm:w-3/4 lg:w-1/2 max-w-3xl">
                <img
                    src="/images/logo.jpeg"
                    alt="Logo"
                    className="mx-auto mb-4 w-32 h-auto rounded-lg"
                />
                <h3 className="text-2xl font-bold text-black mb-6">
                    Sign In Required
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                    You need to sign in to enjoy Mziki Ni Tamu contents. Please log in or signup to continue.
                </p>
                <div className="flex justify-center">
                    <SignInButton />
                </div>
            </div>
        </div>
    );
};

export default SignInModal;
