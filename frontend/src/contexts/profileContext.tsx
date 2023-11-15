import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { User } from "../reducers/authSlice";
import { SolvedQuestion } from "../models/SolvedQuestion.model";
import { fetchUserCompletedQuestions } from "../api/user";


interface ProfileContextInteface {
  solvedQuestions: SolvedQuestion[],
  displayedUser: User | null
}


const ProfileContext = createContext<ProfileContextInteface>({
  solvedQuestions: [],
  displayedUser: null
});
export const useProfile = () => useContext(ProfileContext)

interface ProfileProviderProps {
  displayedUser: User
  children: ReactNode;
}

export function ProfileProvider({ displayedUser, children }: ProfileProviderProps) {
  const [solvedQuestions, setSolvedQuestions] = useState<SolvedQuestion[]>([]);

  useEffect(() => {
    const loadSolvedQuestions = async () => {
      if (displayedUser?.id) {
        try {
          const data = await fetchUserCompletedQuestions(displayedUser?.id);
          data.reverse(); // sort from latest to oldest
          setSolvedQuestions(data);
        } catch (error) {
          console.error("Failed to fetch solved questions:", error);
        }
      }
    };

    loadSolvedQuestions();

  }, [displayedUser])

  const value = {
    displayedUser,
    solvedQuestions
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}