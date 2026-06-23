import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Loading, { setProgress } from "../utils/loading";
import { skipLoadingInDev } from "../hooks/useDevInitialFX";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(!skipLoadingInDev);
  const [loading, setLoading] = useState(0);

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };

  useEffect(() => {
    if (skipLoadingInDev) return;
    const progress = setProgress(setLoading);
    return () => progress.clear();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("loading-active", isLoading);
    return () => document.body.classList.remove("loading-active");
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className={`main-body${isLoading ? " is-loading" : ""}`}>
        {children}
      </main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
