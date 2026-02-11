import { Upload, X, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    currentImageUrl?: string;
    onUpload: (file: File) => Promise<void>;
    label: string;
    className?: string;
    aspectRatio?: "square" | "banner";
    isCircular?: boolean;
    disabled?: boolean;
}

export const ImageUpload = ({
    currentImageUrl,
    onUpload,
    label,
    className = "",
    aspectRatio = "square",
    isCircular = false,
    disabled = false
}: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size must be less than 2MB");
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
            toast.error("Only JPG, PNG and WebP files are allowed");
            return;
        }

        try {
            setIsUploading(true);
            await onUpload(file);
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleClick = () => {
        if (disabled) return;
        fileInputRef.current?.click();
    };

    return (
        <div className={`relative group overflow-hidden ${className} ${isCircular ? "rounded-full" : "rounded-xl"} ${disabled ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`} onClick={handleClick}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
            />

            {/* Current Image or Placeholder */}
            {currentImageUrl ? (
                <img
                    src={currentImageUrl}
                    alt={label}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isUploading ? 'opacity-50' : 'group-hover:opacity-80'}`}
                />
            ) : (
                <div className={`w-full h-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200 transition-colors group-hover:bg-slate-50`}>
                    <div className="text-center p-4">
                        <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <span className="text-xs text-slate-500 font-medium">{label}</span>
                    </div>
                </div>
            )}

            {/* Overlay for Upload/Loading */}
            <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-200 ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {isUploading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                    <Upload className="w-6 h-6 text-white" />
                )}
            </div>
        </div>
    );
};
