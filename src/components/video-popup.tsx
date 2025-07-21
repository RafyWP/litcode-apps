
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const YOUTUBE_VIDEO_URL = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_URL || "https://www.youtube.com/embed/dQw4w9WgXcQ";

interface VideoPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoPopup({ open, onOpenChange }: VideoPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 border-0">
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={YOUTUBE_VIDEO_URL}
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
