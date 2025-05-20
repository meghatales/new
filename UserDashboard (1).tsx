// src/components/dashboard/UserDashboard.tsx
`use client`;

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // A custom hook to get current user
import { doc, getDoc, updateDoc, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Define interfaces for user data and purchases (can be expanded)
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  createdAt?: any; // Firestore Timestamp
  dailyPdfPreviewTime?: number;
  lastPreviewDate?: string | null; // Store as YYYY-MM-DD string
}

interface Purchase {
  id: string;
  itemName: string;
  itemType: 'Book' | 'PDF Subscription' | 'Magazine Subscription'; // Example types
  amount: number;
  purchaseDate: any; // Firestore Timestamp
  status: string;
}

const UserDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPurchases, setLoadingPurchases] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setLoadingProfile(true);
        try {
          const userDocRef = doc(firestore, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            setError("User profile not found.");
          }
        } catch (err) {
          console.error("Error fetching user profile: ", err);
          setError("Failed to load profile.");
        }
        setLoadingProfile(false);
      };

      const fetchPurchases = async () => {
        setLoadingPurchases(true);
        try {
          // Placeholder: In a real app, this would query a 'purchases' collection
          // filtered by user.uid
          // const purchasesQuery = query(
          //   collection(firestore, "purchases"), 
          //   where("userId", "==", user.uid),
          //   orderBy("purchaseDate", "desc")
          // );
          // const querySnapshot = await getDocs(purchasesQuery);
          // const purchasesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Purchase));
          // setPurchases(purchasesData);
          
          // Mock data for now
          const mockPurchases: Purchase[] = [
            { id: "1", itemName: "The Great Novel", itemType: "Book", amount: 499, purchaseDate: { toDate: () => new Date(Date.now() - 86400000 * 5) }, status: "Delivered" },
            { id: "2", itemName: "Advanced Calculus PDF", itemType: "PDF Subscription", amount: 50, purchaseDate: { toDate: () => new Date(Date.now() - 86400000 * 2) }, status: "Active" },
          ];
          setPurchases(mockPurchases);

        } catch (err) {
          console.error("Error fetching purchases: ", err);
          setError("Failed to load purchase history.");
        }
        setLoadingPurchases(false);
      };

      fetchProfile();
      fetchPurchases();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out: ", error);
      setError("Failed to sign out. Please try again.");
    }
  };

  const getRemainingPreviewTime = () => {
    if (!profile) return 0;
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastPreviewDate === today) {
      return Math.max(0, (30 * 60) - (profile.dailyPdfPreviewTime || 0)); // 30 minutes in seconds
    }
    return 30 * 60; // Full time if new day or no preview yet
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  if (authLoading || loadingProfile) {
    return <p className="text-center py-10">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  if (!profile) {
    return <p className="text-center py-10">Could not load user profile.</p>;
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">
          Welcome, {profile.displayName || profile.email}!
        </h1>
        <button
          onClick={handleSignOut}
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Sign Out
        </button>
      </div>

      {/* Profile Information - Can be expanded to an editable form */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">My Profile</h2>
        <div className="space-y-3">
          <p><span className="font-medium">Email:</span> {profile.email}</p>
          <p><span className="font-medium">Display Name:</span> {profile.displayName || "Not set"}</p>
          {/* Add more profile fields as needed */}
        </div>
        {/* <button className="mt-4 px-4 py-2 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600">Edit Profile</button> */}
      </section>

      {/* PDF Preview Time Management */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">PDF Preview Time</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Daily free preview time remaining: 
          <span className="font-bold text-indigo-600 dark:text-indigo-400 ml-2">
            {formatTime(getRemainingPreviewTime())}
          </span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          (Total 30 minutes per day. Resets daily.)
        </p>
      </section>

      {/* Purchase History */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">My Purchases</h2>
        {loadingPurchases ? (
          <p>Loading purchase history...</p>
        ) : purchases.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">You have no purchases yet.</p>
        ) : (
          <ul className="space-y-4">
            {purchases.map(purchase => (
              <li key={purchase.id} className="p-4 border dark:border-gray-700 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{purchase.itemName} ({purchase.itemType})</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date: {purchase.purchaseDate.toDate().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400">₹{purchase.amount.toFixed(2)}</p>
                    <p className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${purchase.status === 'Active' || purchase.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100'}`}>{purchase.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Subscriptions Management - Placeholder */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">My Subscriptions</h2>
        <p className="text-gray-600 dark:text-gray-300">Subscription management functionality will be available here soon. (Placeholder)</p>
        {/* Example: List active PDF subscriptions or magazine subscriptions */}
      </section>

    </div>
  );
};

export default UserDashboard;

