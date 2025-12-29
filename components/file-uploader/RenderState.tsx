import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { ShimmeringText } from "@/components/ui/shimmering-text";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your files here or{" "}
        <span className="text-primary font-bold cursor-pointer">
          click to upload
        </span>
      </p>
      <Button className="mt-4" type="button">
        Select File
      </Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className=" text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className={cn("size-6 text-destructive-foreground")} />
      </div>
      <p className="text-base font-semibold"> Upload Failed</p>
      <p className="text-xs mt-1 text-muted-foreground ">
        Something went wrong{" "}
      </p>
      <Button className="mt-4" type="button">
        Retry to Upload
      </Button>
    </div>
  );
}

export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleRemoveFile,
  fileType,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
    fileType: "image" | "video";
}) {
  return (
    <div className="relative group w-full h-full flex items-center justify center">
      {fileType === 'video' ?(
        <video src={ previewUrl} controls className="rounded-md w-full h-full "  />
      ): (
        <Image
          src={previewUrl}
          alt="Uploaded File"
          fill
          className="object-contain p-2"
        />
      )}
      <Button
        variant="destructive"
        size="icon"
        className={cn("absolute top-4 right-4")}
        type="button"
        onClick={handleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function RenderUploadingState({
  progress,
}: {
  progress: number;
}) {
  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-center">
        <div className="relative inline-flex items-center justify-center">
          <svg
            width={size}
            height={size}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              className="text-muted"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-primary transition-all duration-300 ease-out"
            />
          </svg>
          {/* Progress percentage in center */}
          <span className="absolute text-sm font-semibold text-foreground">
            {progress}%
          </span>
        </div>
        <div className="mt-4 text-center">
          <ShimmeringText
            text="Uploading..."
            className="text-sm font-medium"
          />
        </div>
      </div>
    </div>
  );
}
