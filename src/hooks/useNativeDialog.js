import { useEffect, useRef } from "react";

const useNativeDialog = (isOpen = true, onClose) => {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return undefined;

    const handleClose = () => onCloseRef.current?.();
    dialog.addEventListener("close", handleClose);

    if (!dialog.open) {
      dialog.showModal();
    }

    return () => {
      dialog.removeEventListener("close", handleClose);
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  return dialogRef;
};

export default useNativeDialog;
