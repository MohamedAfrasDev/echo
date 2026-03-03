"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@workspace/ui/components/dropzone";

interface UploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFileUploaded?: () => void;
}


export const UploadDialog = ({
    open,
    onOpenChange,
    onFileUploaded,
}: UploadDialogProps) => {
    const addFile = useAction(api.private.files.addFile);

    const [uploadedFiles, setUploadFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        category: "",
        filename: ""
    });

    const handleFileDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        if (file) {
            const previousSelectedName = uploadedFiles[0]?.name;

            setUploadFiles([file]);
            setUploadForm((prev) => {
                const shouldAutofill =
                    !prev.filename || prev.filename === previousSelectedName;
                return {
                    ...prev,
                    filename: shouldAutofill ? file.name : prev.filename,
                };
            });
        }
    };

    const handleUpload = async () => {
        setIsUploading(true);
        try {
            const blob = uploadedFiles[0];

            if (!blob) {
                return;

            }

            const filename = uploadForm.filename || blob.name;

            await addFile({
                bytes: await blob.arrayBuffer(),
                filename,
                mimeType: blob.type || "text/plain",
                category: uploadForm.category,
            });

            onFileUploaded?.();
            handleCancel();
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    }


    const resetForm = () => {
        setUploadFiles([]);
        setUploadForm({
            category: "",
            filename: "",
        });
    };

    const handleCancel = () => {
        onOpenChange(false);
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            resetForm();
        }
        onOpenChange(newOpen);
    };
    return (
        <Dialog onOpenChange={handleOpenChange} open={open}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Upload Document
                    </DialogTitle>
                    <DialogDescription>
                        Upload a document to be used as knowledge base for the AI assistant.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            value={uploadForm.category}
                            type="text"
                            onChange={(e) => setUploadForm((prev) => ({ ...prev, category: e.target.value }))}
                            placeholder="Enter category e.g. Documentation, Support, Product"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="filename">Filename{" "}
                            <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                        <Input
                            id="filename"
                            value={uploadForm.filename}
                            type="text"
                            onChange={(e) => setUploadForm((prev) => ({ ...prev, filename: e.target.value }))}
                            placeholder="Override default filename"
                        />
                    </div>


                    <Dropzone accept={{
                        "application/pdf": [".pdf"],
                        "text/csv": [".csv"],
                        "text/plain": [".txt"]
                    }}
                        disabled={isUploading}
                        maxFiles={1}
                        onDrop={handleFileDrop}
                        src={uploadedFiles} >
                        <DropzoneEmptyState />

                        <DropzoneContent />

                    </Dropzone>

                </div>

                <DialogFooter>
                    <Button
                        disabled={isUploading}
                        onClick={handleCancel}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={uploadedFiles.length === 0 || isUploading || !uploadForm.category}
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}