import React, {
  cloneElement,
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import useOutsideClick from '../_hooks/useOutsideClick';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ModalContext {
  isOpen: boolean;
  close: () => void;
  open: () => void;
}

const ModalContext = createContext<ModalContext | null>(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Used outside of ModalContext');
  return context;
}

function Modal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  function close() {
    setIsOpen(false);
  }
  function open() {
    setIsOpen(true);
  }

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);
  return (
    <ModalContext.Provider value={{ isOpen, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Trigger({
  children,
}: {
  children: ReactElement<{ onClick?: ModalContext['open'] }>;
}) {
  const { open } = useModalContext();

  return cloneElement(children, { onClick: open });
}

const Window = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, close } = useModalContext();
  const ref = useOutsideClick<HTMLDivElement>(close, true);

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 backdrop-blur-md z-50'>
      <div
        ref={ref}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 w-4/6 max-w-[40rem]'
      >
        <button onClick={close} className='p-2 absolute right-0 top-0'>
          <XMarkIcon className='w-4 h-4  text-primary-950'></XMarkIcon>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};

Modal.Trigger = Trigger;
Modal.Window = Window;

export default Modal;
