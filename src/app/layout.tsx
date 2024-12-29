import Navigation from "@/components/shared/Navigation/Navigation";
import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import CurrentUserProvider from "@/context/CurrentUserContext";
import getCurrentUser from "@/actions/getCurrentUser";
import CreateChannelModalProvider from "@/context/CreateChannelModalContext";
import CreateChannelModal from "@/components/shared/Modal/CreateChannelModal";
import { Toaster } from "react-hot-toast";
import getCurrentChannel from "@/actions/getCurrentChannel";
import CurrentChannelProvider from "@/context/CurrentChannelContext";
import UploadVideoModalProvider from "@/context/UploadVideoModalContext";
import SidebarProvider from "@/context/SidebarContext";
import {PaidSubscriptionProvider} from "@/context/PaidSubscriptionContext";
import SignInModal from "@/components/shared/Modal/SignInModal";
import getPaidSubscriptions from "@/actions/getPaidSubscriptions";
import PhoneNumberModalClient from "@/components/shared/Modal/PhoneNumberModalClient";
const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
    title: "Mziki Ni Tamu",
    description: "Ngoma Za Hekima ",
};

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const currentUser = await getCurrentUser();
    const currentChannel = await getCurrentChannel();
    console.log("===email", currentUser?.email);
    const paidSubscription = await getPaidSubscriptions(currentUser?.id ?? null);

    console.log("==subscription",paidSubscription);

    return (
        <html lang="en">
        <body className={roboto.className}>
        {/* Display SignInModal if no currentUser */}
        {!currentUser?.email && <SignInModal />}
        {!paidSubscription && currentUser?.id && (
            <PhoneNumberModalClient
                userId={currentUser.id}
                phoneNumber={currentUser.phoneNumber}
            />
        )}
        <CreateChannelModalProvider>
            <Toaster toastOptions={{ position: "bottom-left" }} />
            <CreateChannelModal />
            <CurrentUserProvider user={currentUser}>
                <CurrentChannelProvider channel={currentChannel}>
                    <UploadVideoModalProvider>
                        <SidebarProvider>
                            <PaidSubscriptionProvider email={currentUser?.email ?? null}> {/* Provide the email of the logged-in user */}
                            <Navigation />
                            <div className="pt-16">{children}</div>
                            </PaidSubscriptionProvider>
                        </SidebarProvider>
                    </UploadVideoModalProvider>
                </CurrentChannelProvider>
            </CurrentUserProvider>
        </CreateChannelModalProvider>
        </body>
        </html>
    );
}