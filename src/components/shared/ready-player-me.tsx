/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReadyPlayerMeCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarExported: (avatarUrl: string) => void;
}

export function ReadyPlayerMeCreator({
  isOpen,
  onClose,
  onAvatarExported,
}: ReadyPlayerMeCreatorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const subdomain = "demo";

  useEffect(() => {
    function subscribe(event: MessageEvent) {
      const json = parse(event);

      if (json?.source !== "readyplayerme") {
        return;
      }

      // Supress frame events
      if (json.eventName === "v1.frame.ready") {
        setIsLoading(false);
      }

      // Get avatar URL
      if (json.eventName === "v1.avatar.exported") {
        const url = json.data?.url;
        if (url) {
          const pngUrl =
            url.replace(".glb", ".png") +
            "?scene=halfbody-portrait-v1-transparent&blendShapes[Wolf3D_Head][mouthSmile]=0.3";
          onAvatarExported(pngUrl);
          onClose();
        }
      }

      if (json.eventName === "v1.user.set") {
        console.log(`User with id ${json.data.id} set: ${json.data}`);
      }
    }

    function parse(event: MessageEvent) {
      try {
        return typeof event.data === "string"
          ? JSON.parse(event.data)
          : event.data;
      } catch (error) {
        console.error("Error parsing event data:", error);
        return null;
      }
    }

    if (isOpen) {
      window.addEventListener("message", subscribe);
      document.addEventListener("message", subscribe as any);
    }

    return () => {
      window.removeEventListener("message", subscribe);
      document.removeEventListener("message", subscribe as any);
    };
  }, [isOpen, onAvatarExported, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Criar Avatar 3D</DialogTitle>
        </DialogHeader>

        <div className="relative flex-1 w-full bg-muted/20">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={`https://${subdomain}.readyplayer.me/avatar?frameApi`}
            allow="camera *; microphone *"
            className="w-full h-full border-0"
            title="Ready Player Me"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
