"use client";

import { Modal } from "@heroui/react";
import { useCallback, useRef, useState } from "react";

import { BoutonAdmin } from "./kit";

interface OptionsConfirmation {
  titre: string;
  message?: React.ReactNode;
  libelleConfirmer?: string;
  danger?: boolean;
}

/**
 * Fenêtre de confirmation (suppression, retrait…) :
 * `const { confirmer, fenetre } = useConfirmation(); … if (await confirmer({...})) …`
 */
export function useConfirmation() {
  const [options, setOptions] = useState<OptionsConfirmation | null>(null);
  const resolution = useRef<(v: boolean) => void>(undefined);

  const confirmer = useCallback((o: OptionsConfirmation) => {
    setOptions(o);

    return new Promise<boolean>((r) => {
      resolution.current = r;
    });
  }, []);

  const fermer = (v: boolean) => {
    resolution.current?.(v);
    setOptions(null);
  };

  const fenetre = (
    <Modal.Backdrop
      isOpen={!!options}
      onOpenChange={(o) => !o && fermer(false)}
    >
      <Modal.Container size="sm">
        <Modal.Dialog className="rounded-admin">
          <Modal.Header>
            <Modal.Heading className="font-heading text-lg font-extrabold text-marine">
              {options?.titre}
            </Modal.Heading>
          </Modal.Header>
          {options?.message && (
            <Modal.Body className="text-sm leading-[1.55] text-encre-douce">
              {options.message}
            </Modal.Body>
          )}
          <Modal.Footer className="flex justify-end gap-2.5">
            <BoutonAdmin variante="neutre" onPress={() => fermer(false)}>
              Annuler
            </BoutonAdmin>
            <BoutonAdmin
              variante={options?.danger ? "primaire" : "marine"}
              onPress={() => fermer(true)}
            >
              {options?.libelleConfirmer ?? "Confirmer"}
            </BoutonAdmin>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );

  return { confirmer, fenetre };
}
