import getTrendingVideos from "@/actions/getTrendingVideos";
import VideoCard from "@/components/shared/VideoCard";
import SignInButton from "@/components/shared/Navigation/Navbar/UserOptions/SignInButton";
import getCurrentUser from "@/actions/getCurrentUser";

export default async function Home() {
  const currentUser = await getCurrentUser();

    if (!currentUser) {
        // Display the Sign-In modal if the user is not logged in
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-8 sm:p-10 rounded-lg shadow-lg text-center w-11/12 sm:w-3/4 lg:w-1/2 max-w-3xl">
                    <h2 className="text-2xl font-bold text-black mb-6">
                        Sign In Required
                    </h2>
                    <p className="text-lg text-gray-700 mb-6">
                        You need to sign in to enjoy Mziki Ni Tamu Contents. Please log in or signup to continue.
                    </p>
                    <div className="flex justify-center">
                        <SignInButton />
                    </div>

                </div>
            </div>
        );
    }

    const trendingVideos = await getTrendingVideos();

  return (
    <div className="mx-12 sm:mx-24 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {trendingVideos
        ? trendingVideos.map((trendingVideo) => {
            return (
              <VideoCard
                key={trendingVideo.id}
                video={trendingVideo}
                channel={trendingVideo.channel}
                channelAvatar
              />
            );
          })
        : "No videos found"}
    </div>
  );
}
