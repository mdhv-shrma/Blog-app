import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function UserProfilePage() {
  const router = useRouter();
  const { id } = router.query; // Get user ID from the URL
  const { data: session } = useSession();
  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    if (id && session) {
      const fetchProfileData = async () => {
        try {
          const res = await fetch(`/api/users/${id}`);
          const data = await res.json();

          if (data.user) {
            setProfileUser(data.user);
            // Recalculate isFollowing based on the latest profile data
            setIsFollowing(
              data.user.followers?.some((followerId) => followerId === session.user.id) || false
            );
          } else {
            console.error("User data is undefined");
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

      fetchProfileData();
    }
  }, [id, session]); // Ensure this runs whenever `id` or `session` changes

  useEffect(() => {
    if (id) {
      const fetchFollowersFollowing = async () => {
        try {
          const res = await fetch(`/api/users/followers-following?userId=${id}`);
          const data = await res.json();

          setFollowers(data.followers || []);
          setFollowing(data.following || []);
        } catch (error) {
          console.error("Error fetching followers and following:", error);
        }
      };

      fetchFollowersFollowing();
    }
  }, [id]);

  const handleFollow = async () => {
    try {
      const res = await fetch("/api/users/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, targetUserId: id }),
      });
      if (res.ok) {
        setIsFollowing(true);
        setProfileUser((prev) => ({
          ...prev,
          followers: [...(prev.followers || []), session.user.id],
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
        body: JSON.stringify({ userId: session.user.id, targetUserId: id }),
      });
      if (res.ok) {
        setIsFollowing(false);
        setProfileUser((prev) => ({
          ...prev,
          followers: (prev.followers || []).filter((userId) => userId !== session.user.id),
        }));
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (!profileUser) {
    return <p className="text-center mt-10 text-xl text-gray-600">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
        {profileUser.name}
      </h2>
      <p>
        <strong>Email:</strong> {profileUser.email}
      </p>
      <p>
        <strong>Followers:</strong> {profileUser.followers?.length || 0}
        <button
          onClick={() => setShowFollowers((prev) => !prev)}
          className="ml-2 text-blue-500 underline"
        >
          {showFollowers ? "Hide" : "View"}
        </button>
      </p>
      {showFollowers && (
        <ul className="mt-2">
          {followers.map((follower) => (
            <li key={follower._id}>{follower.name} ({follower.email})</li>
          ))}
        </ul>
      )}
      <p>
        <strong>Following:</strong> {profileUser.following?.length || 0}
        <button
          onClick={() => setShowFollowing((prev) => !prev)}
          className="ml-2 text-blue-500 underline"
        >
          {showFollowing ? "Hide" : "View"}
        </button>
      </p>
      {showFollowing && (
        <ul className="mt-2">
          {following.map((followed) => (
            <li key={followed._id}>{followed.name} ({followed.email})</li>
          ))}
        </ul>
      )}

      {session?.user?.id !== id && (
        <div className="mt-4">
          {isFollowing ? (
            <button
              onClick={handleUnfollow}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Follow
            </button>
          )}
        </div>
      )}
    </div>
  );
}
