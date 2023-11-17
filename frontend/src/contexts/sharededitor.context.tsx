import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Question } from "../models/Question.model";
import { useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";


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

  const memo = useMemo(() => {
    return {
      qn,
    };
  }, [qn]);

  return (
    <SharedEditorContext.Provider value={memo}>
      {children}
    </SharedEditorContext.Provider>
  );
};

export const useSharedEditor = () => useContext(SharedEditorContext);
