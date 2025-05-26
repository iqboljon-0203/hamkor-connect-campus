import { createContext, useContext, useState, ReactNode } from "react";
import { CreateGroupModal } from "@/components/modals/CreateGroupModal";

interface GroupModalContextType {
  open: () => void;
  close: () => void;
}

const GroupModalContext = createContext<GroupModalContextType | undefined>(
  undefined
);

export function useGroupModal() {
  const ctx = useContext(GroupModalContext);
  if (!ctx)
    throw new Error("useGroupModal must be used within GroupModalProvider");
  return ctx;
}

export function GroupModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // TODO: onSubmit funksiyasini kerakli joydan import qiling yoki context orqali uzating
  const handleSubmit = (data: any) => {
    // Guruh yaratish logikasi (hozircha faqat modalni yopadi)
    handleClose();
  };

  return (
    <GroupModalContext.Provider
      value={{ open: handleOpen, close: handleClose }}
    >
      {children}
      <CreateGroupModal
        isOpen={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </GroupModalContext.Provider>
  );
}
