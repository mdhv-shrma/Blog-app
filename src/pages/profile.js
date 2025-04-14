import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null); // Store profile user data
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      const fetchProfileData = async () => {
        try {
          const res = await fetch(`/api/users/${session.user.id}`);
          const data = await res.json();
          setProfileUser(data.user);
          setIsFollowing(data.user.followers.includes(session.user.id));
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

      const fetchUserPosts = async () => {
        try {
          const res = await fetch(`/api/posts/byAuthor?author=${encodeURIComponent(session.user.name)}`);
          const data = await res.json();
          setPosts(data.posts);
        } catch (error) {
          console.error("Error fetching user posts:", error);
        }
      };

      fetchProfileData();
      fetchUserPosts();
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchFollowersFollowing = async () => {
        try {
          const res = await fetch(`/api/users/followers-following?userId=${session.user.id}`);
          const data = await res.json();

          setFollowers(data.followers || []);
          setFollowing(data.following || []);
        } catch (error) {
          console.error("Error fetching followers and following:", error);
        }
      };

      fetchFollowersFollowing();
    }
  }, [session]);

  const handleFollow = async () => {
    try {
      const res = await fetch("/api/users/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, targetUserId: profileUser._id }),
      });
      if (res.ok) {
        setIsFollowing(true);
        setProfileUser((prev) => ({
          ...prev,
          followers: [...prev.followers, session.user.id],
        }));
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const res = await fetch("/api/users/unfollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, targetUserId: profileUser._id }),
      });
      if (res.ok) {
        setIsFollowing(false);
        setProfileUser((prev) => ({
          ...prev,
          followers: prev.followers.filter((id) => id !== session.user.id),
        }));
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (status === "loading") {
    return <p className="text-center mt-10 text-xl text-gray-600">Loading...</p>;
  }

  if (!session || !profileUser) {
    return null; // Prevent rendering if not authenticated or profile data is not loaded
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profileUser.name[0]}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{profileUser.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{profileUser.email}</p>
          <div className="mt-4 flex gap-4">
            <div>
              <strong>{profileUser.followers.length}</strong> Followers
              <button
                onClick={() => setShowFollowers((prev) => !prev)}
                className="ml-2 text-blue-500 underline"
              >
                {showFollowers ? "Hide" : "View"}
              </button>
            </div>
            <div>
              <strong>{profileUser.following.length}</strong> Following
              <button
                onClick={() => setShowFollowing((prev) => !prev)}
                className="ml-2 text-blue-500 underline"
              >
                {showFollowing ? "Hide" : "View"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFollowers && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Followers</h3>
          <ul className="mt-2 space-y-2">
            {followers.map((follower) => (
              <li key={follower._id} className="text-gray-700 dark:text-gray-300">
                {follower.name} ({follower.email})
              </li>
            ))}
          </ul>
        </div>
      )}

      {showFollowing && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Following</h3>
          <ul className="mt-2 space-y-2">
            {following.map((followed) => (
              <li key={followed._id} className="text-gray-700 dark:text-gray-300">
                {followed.name} ({followed.email})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Your Posts</h3>
        {posts?.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 mt-4">You have not created any posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {posts.map((post) => (
              <Link key={post._id} href={`/posts/${post.slug}`} className="block bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400">{post.title}</h4>
                <p className="text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">{post.description || "Read more..."}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
