"use client";


import React, { useState } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll';
import { InfiniteScrollTrigger } from '@workspace/ui/hooks/infinite-scroll-trigger';
import { usePaginatedQuery } from 'convex/react';
import { Badge } from "@workspace/ui/components/badge";
import { api } from '@workspace/backend/convex/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { FileIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";
import { UploadDialog } from '../components/upload-dialog';
import { DeleteFileDialog } from '../components/delete-file-dialog';
import { PublicFile } from '@workspace/backend/convex/private/files';
export const FilesView = () => {

    const files = usePaginatedQuery(
        api.private.files.list,
        {},
        {
            initialNumItems: 10
        }
    )

    const {
        topElementRef,
        handleLoadMore,
        canLoadMore,
        isLoadingFirstPage,
        isLoadingMore
    } = useInfiniteScroll({
        status: files.status,
        loadMore: files.loadMore,
        loadSize: 10,
    })

    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null);
    const handleDeleteClick = (file: PublicFile) => {
        setSelectedFile(file);
        setDeleteDialogOpen(true);
    }

    const handleFileDeleted = () => {
        setSelectedFile(null);
    }

    return (
        <>
            <DeleteFileDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen} file={selectedFile} onDeleted={handleFileDeleted} />

            <UploadDialog onOpenChange={setUploadDialogOpen} open={uploadDialogOpen} />

            <div className='flex min-h-screen flex-col bg-muted p-8'>
                <div className='mx-auto w-full max-w-screen-md'>
                    <div className='space-y-2'>
                        <h1 className='text-2xl md:text-4xl'>
                            Knowledge Base
                        </h1>
                        <p className='text-muted-foreground'>
                            Upload and manage documents for your AI assistant
                        </p>
                    </div>

                    <div className='mt-8 rounded-lg border bg-background'>
                        <div className='flex items-center justify-end border-b px-6 py-4'>
                            <Button
                                onClick={() => { setUploadDialogOpen(true) }}
                            >
                                <PlusIcon />
                                Add New
                            </Button>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='px-6 py-4 font-medium'>Name</TableHead>
                                    <TableHead className='px-6 py-4 font-medium'>Type</TableHead>
                                    <TableHead className='px-6 py-4 font-medium'>Size</TableHead>
                                    <TableHead className='px-6 py-4 font-medium'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {isLoadingFirstPage && (
                                    <TableRow>
                                        <TableCell className='h-24 text-center' colSpan={4}>
                                            Loading Files
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!isLoadingFirstPage && files.results.length === 0 && (
                                    <TableRow>
                                        <TableCell className='h-24 text-center' colSpan={4}>
                                            No Files Found
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!isLoadingFirstPage &&
                                    files.results.map((file) => (
                                        <TableRow className='hover:bg-muted/50' key={file.id}>
                                            <TableCell className='px-6 py-4 font-medium'>
                                                <div className='flex items-center gap-3'>
                                                    <FileIcon />
                                                    {file.name}
                                                </div>
                                            </TableCell>

                                            <TableCell className='px-6 py-4 font-medium'>
                                                <Badge className='uppercase' variant="outline">
                                                    {file.type}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className='px-6 py-4 text-muted-foreground'>
                                                {file.size}
                                            </TableCell>

                                            <TableCell className='px-6 py-4'>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            aria-label={`Actions for ${file.name}`}
                                                            className='size-8 p-0'
                                                            size="sm"
                                                            variant="ghost"
                                                        >
                                                            <MoreHorizontalIcon aria-hidden="true" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align='end'>
                                                        <DropdownMenuItem
                                                            className='text-destructive'
                                                            onClick={() => handleDeleteClick(file)}
                                                        >
                                                            <TrashIcon className='size-4 mr-2' />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                {!isLoadingFirstPage && files.results.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="p-0">
                                            <div className="border-t">
                                                <InfiniteScrollTrigger
                                                    canLoadMore={canLoadMore}
                                                    isLoadingMore={isLoadingMore}
                                                    onLoadMore={handleLoadMore}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div></>
    )
}

export default FilesView