import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Question } from "../models/Question.model";
import { useSelector } from "react-redux";
import { User, selectUser } from "../reducers/authSlice";
import { Navigate, useLoaderData } from "react-router-dom";
import data from "../data/lang_temps.json";

export type language = keyof typeof data;

export const langList = Object.keys(data) as language[];
export const LangDataMap = data;

export type chatRecord = {
  nickname: string;
  msg: string;
  avatar?: string;
};

type executionResult =
  | "Accepted"
  | "TLE"
  | "MLE"
  | "WA"
  | "Compile Error"
  | "Runtime Error"
  | "Unknown";

export type SubmissionResult = {
  evaluated: number;
  total: number;
  verdict: string;
  completed: boolean;
};

export type submissionRecord = {
  time: number;
  userIds: number[];
  qn_id: string;
  code: string;
  lang: language;
  result: executionResult;
};

interface SharedEditorInterface {
  qn?: Question;
}

export const SharedEditorContext = createContext<SharedEditorInterface>({});

export const SharedEditorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const qn = useLoaderData() as Question | undefined;
  const user = useSelector(selectUser) as User; // null check should be done before this

  const memo = useMemo(() => {
    return {
      qn,
    };
  }, [qn, user]);

  return (
    <SharedEditorContext.Provider value={memo}>
      {children}
    </SharedEditorContext.Provider>
  );
};

export const useSharedEditor = () => useContext(SharedEditorContext);
