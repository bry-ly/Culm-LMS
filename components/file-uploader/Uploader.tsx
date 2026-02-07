"use client";

import * as React from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { cn } from "@/lib/utils";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface UploaderContextValue {
  state: UploaderState;
  isDragActive: boolean;
  getRootProps: ReturnType<typeof useDropzone>["getRootProps"];
  getInputProps: ReturnType<typeof useDropzone>["getInputProps"];
  handleRemoveFile: () => Promise<void>;
}

const UploaderContext = React.createContext<UploaderContextValue | null>(null);

function useUploader() {
  const context = React.useContext(UploaderContext);
  if (!context) {
    throw new Error("useUploader must be used within UploaderProvider");
  }
  return context;
}

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface UploaderProviderProps {
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted: "image" | "video";
  children: React.ReactNode;
}

function UploaderProvider({
  value,
  onChange,
  fileTypeAccepted,
  children,
}: UploaderProviderProps) {
  const fileUrl = useConstructUrl(value || "");
  const [fileState, setFileState] = React.useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: fileTypeAccepted,
    key: value,
    objectUrl: value ? fileUrl : undefined,
  });

  const uploadFile = React.useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
      }));

      try {
        const presignedResponse = await fetch("/api/s3/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: fileTypeAccepted === "image" ? true : false,
          }),
        });

        if (!presignedResponse.ok) {
          toast.error("Failed to get presigned URL");
          setFileState((prev) => ({
            ...prev,
            uploading: false,
            progress: 0,
            error: true,
          }));
          return;
        }

        const { presignedUrl, key } = await presignedResponse.json();

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", presignedUrl);
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setFileState((prev) => ({
                ...prev,
                progress,
              }));
            }
          };
          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 204) {
              setFileState((prev) => ({
                ...prev,
                progress: 100,
                uploading: false,
                key: key,
              }));

              onChange?.(key);

              toast.success("File uploaded Successfully");
              resolve();
            } else {
              reject(new Error("Upload Failed"));
            }
          };
          xhr.onerror = () => {
            reject(new Error("Upload Failed"));
          };
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch {
        toast.error("Something went wrong");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
      }
    },
    [fileTypeAccepted, onChange]
  );

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        setFileState({
          file: file,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          error: false,
          id: uuidv4(),
          isDeleting: false,
          fileType: fileTypeAccepted,
        });

        uploadFile(file);
      }
    },
    [fileState.objectUrl, fileTypeAccepted, uploadFile]
  );

  const handleRemoveFile = React.useCallback(async () => {
    if (fileState.isDeleting || !fileState.objectUrl) return;
    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: fileState.key,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to remove file form storage");
        setFileState((prev) => ({
          ...prev,
          isDeleting: true,
          error: true,
        }));
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");

      setFileState(() => ({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        fileType: fileTypeAccepted,
        id: null,
        isDeleting: false,
      }));
      toast.success("File removed successfully");
    } catch {
      toast.error("File removed failed");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  }, [
    fileState.isDeleting,
    fileState.objectUrl,
    fileState.key,
    onChange,
    fileTypeAccepted,
  ]);

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "to-many-files"
      );
      const filesSizeToBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );

      if (filesSizeToBig) {
        toast.error("File Size exceeds the limit");
      }

      if (tooManyFiles) {
        toast.error("to many files selected, max is 1");
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      fileTypeAccepted === "video" ? { "video/*": [] } : { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize:
      fileTypeAccepted === "image" ? 5 * 1024 * 1024 : 5000 * 1024 * 1024,
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  React.useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  return (
    <UploaderContext.Provider
      value={{
        state: fileState,
        isDragActive,
        getRootProps,
        getInputProps,
        handleRemoveFile,
      }}
    >
      {children}
    </UploaderContext.Provider>
  );
}

function UploaderTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { getRootProps, getInputProps, isDragActive } = useUploader();

  return (
    <div
      {...getRootProps()}
      className={cn(
        "bg-card text-card-foreground relative flex h-64 w-full flex-col items-center justify-center gap-6 rounded-xl border-2 border-dashed shadow-sm transition-colors duration-200 ease-in-out",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary",
        className
      )}
      {...props}
    >
      <div className="flex h-full w-full items-center justify-center p-4">
        <input {...getInputProps()} />
        {children}
      </div>
    </div>
  );
}

function UploaderEmpty({ children }: { children?: React.ReactNode }) {
  const { isDragActive, state } = useUploader();

  if (children) {
    return <>{children}</>;
  }

  if (state.objectUrl) return null;

  return (
    <div className="text-center">
      <div className="bg-muted mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "text-muted-foreground size-6",
            isDragActive && "text-primary"
          )}
        >
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M12 12v9" />
          <path d="m16 16-4-4-4 4" />
        </svg>
      </div>
      <p className="text-foreground text-base font-semibold">
        Drop your files here or{" "}
        <span className="text-primary cursor-pointer font-bold">
          click to upload
        </span>
      </p>
    </div>
  );
}

function UploaderUploading({ children }: { children?: React.ReactNode }) {
  const { state } = useUploader();

  if (!state.uploading) return null;

  if (children) {
    return <>{children}</>;
  }

  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (state.progress / 100) * circumference;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative inline-flex items-center justify-center">
          <svg width={size} height={size} className="-rotate-90 transform">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              className="text-muted"
            />
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
          <span className="text-foreground absolute text-sm font-semibold">
            {state.progress}%
          </span>
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm font-medium">Uploading...</span>
        </div>
      </div>
    </div>
  );
}

function UploaderError({ children }: { children?: React.ReactNode }) {
  const { state } = useUploader();

  if (!state.error) return null;

  if (children) {
    return <>{children}</>;
  }

  return (
    <div className="text-center">
      <div className="bg-destructive/30 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-destructive-foreground size-6"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
      <p className="text-base font-semibold">Upload Failed</p>
      <p className="text-muted-foreground mt-1 text-xs">Something went wrong</p>
    </div>
  );
}

function UploaderUploaded({ children }: { children?: React.ReactNode }) {
  const { state, handleRemoveFile } = useUploader();

  if (!state.objectUrl || state.uploading) return null;

  if (children) {
    return <>{children}</>;
  }

  return (
    <div className="group relative flex h-full w-full items-center justify-center">
      {state.fileType === "video" ? (
        <video
          src={state.objectUrl}
          controls
          className="h-full w-full rounded-md"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={state.objectUrl}
          alt="Uploaded File"
          className="h-full w-full object-contain p-2"
        />
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveFile();
        }}
        disabled={state.isDeleting}
        className="absolute top-4 right-4 rounded-md bg-red-500 p-2 text-white hover:bg-red-600 disabled:opacity-50"
      >
        {state.isDeleting ? (
          <svg
            className="size-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        )}
      </button>
    </div>
  );
}

export {
  UploaderProvider,
  UploaderTrigger,
  UploaderEmpty,
  UploaderUploading,
  UploaderError,
  UploaderUploaded,
  useUploader,
};
