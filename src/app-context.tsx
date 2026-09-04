import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

export type RouteName =
  | 'dashboard'
  | 'requirements'
  | 'reqDetail'
  | 'vendors'
  | 'upload'
  | 'ratecard'
  | 'generate';

export interface Route {
  name: RouteName;
  param?: string;
}

interface AppCtx {
  route: Route;
  navigate: (name: RouteName, param?: string) => void;
  toast: (msg: string) => void;
  openModal: (node: ReactNode) => void;
  closeModal: () => void;
  // Cross-screen hand-off (e.g. "open the client package for REQ-042").
  intent: { key: string; value: string } | null;
  setIntent: (key: string, value: string) => void;
  clearIntent: () => void;
}

const Ctx = createContext<AppCtx | null>(null);
export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp outside provider');
  return c;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>({ name: 'dashboard' });
  const [modal, setModal] = useState<ReactNode>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [toastOn, setToastOn] = useState(false);
  const [intent, setIntentState] = useState<{ key: string; value: string } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const navigate = useCallback((name: RouteName, param?: string) => {
    setRoute({ name, param });
    document.querySelector('.content')?.scrollTo(0, 0);
  }, []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastOn(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToastOn(false), 2600);
  }, []);

  const value = useMemo<AppCtx>(
    () => ({
      route,
      navigate,
      toast,
      openModal: setModal,
      closeModal: () => setModal(null),
      intent,
      setIntent: (key, value) => setIntentState({ key, value }),
      clearIntent: () => setIntentState(null),
    }),
    [route, navigate, toast, intent]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {modal && (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setModal(null)}>
          {modal}
        </div>
      )}
      <div className={'toast' + (toastOn ? ' on' : '')}>{toastMsg}</div>
    </Ctx.Provider>
  );
}
