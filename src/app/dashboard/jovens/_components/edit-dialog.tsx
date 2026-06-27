/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JovemForm } from "@/components/shared/jovem-form";

interface EditJovemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: any | null;
  onSuccess?: () => void;
}

export function EditJovemDialog({
  isOpen,
  onOpenChange,
  data,
  onSuccess,
}: EditJovemDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{data ? "Editar Jovem" : "Novo Jovem"}</DialogTitle>
        </DialogHeader>
        <JovemForm data={data} onSuccess={handleSuccess} isPublic={false} />
      </DialogContent>
    </Dialog>
  );
}
