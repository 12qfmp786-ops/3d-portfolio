import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Loading from "../utils/loading";
import { skipLoadingInDev } from "../hooks/useDevInitialFX";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(!skipLoadingInDev);
  const initialFxPlayed = useRef(false);

  const value = {
    isLoading,
    setIsLoading,
  };

  useEffect(() => {
    document.body.classList.toggle("loading-active", isLoading);
    return () => document.body.classList.remove("loading-active");
  }, [isLoading]);

  useEffect(() => {
    if (isLoading || skipLoadingInDev || initialFxPlayed.current) return;
    initialFxPlayed.current = true;

    const runInitialFx = () => {
      import("@/app/components/util/initialFX").then((module) => {
        module.initialFX?.();
      });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(runInitialFx);
    });
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading />}
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
