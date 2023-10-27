export interface Match {
    user1: string;
    user2: string;
    questionId: string;
    hostUser: string;
}

export interface User {
    id: string;
    difficultyFrom: number;
    difficultyTo: number;
    matchedWith?: string;
}

export interface UserWithSocketId extends User {
    socketId: string;
    isMatched: boolean;
}