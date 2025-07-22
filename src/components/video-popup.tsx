
"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface VideoPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  youtubeVideoUrl: string; // The URL now comes as a prop.
}

export function VideoPopup({ open, onOpenChange, youtubeVideoUrl }: VideoPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 border-0">
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={youtubeVideoUrl} // Use the prop here.
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}
