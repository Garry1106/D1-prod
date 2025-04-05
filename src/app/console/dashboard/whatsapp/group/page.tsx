'use client';

import { useState, useEffect } from 'react';
import { Users, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { GroupForm } from './GroupForm';
import { SuccessMessage } from './SuccessMessage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table'; // Import shadcn table components
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify styles

interface Group {
    id: number;
    groupName: string;
    contacts: Array<{ name: string; phone: string }>;
}

export default function GroupPage() {
    const [isCreating, setIsCreating] = useState(false); // Toggle form visibility
    const [isSuccess, setIsSuccess] = useState(false); // Success state for group creation
    const [groups, setGroups] = useState<Group[]>([]); // Store groups
    const [isLoading, setIsLoading] = useState(true); // Loading state for groups
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null); // Selected group for popup

    // Fetch groups from the database
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch('/api/Whatsapp/groups');
                if (!response.ok) {
                    throw new Error('Failed to fetch groups');
                }
                const data = await response.json();

                // Debug log to verify response data
                console.log('Fetched Groups:', data);

                setGroups(data); // Update groups list
            } catch (error) {
                toast.error('Unable to fetch groups. Please try again later.'); // Use react-toastify's toast
            } finally {
                setIsLoading(false); // Remove loading state
            }
        };

        fetchGroups();
    }, [isSuccess]); // Re-fetch groups after a successful creation

    return (
        <div className="min-h-screen bg-[#ffffff] text-black p-6">
            <ToastContainer /> {/* Add ToastContainer to render toasts */}
            <div className="mx-auto">
                {/* Page Header */}
                <div className="mb-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-[#41b658]">Group Management</h1>
                            <p className="text-lg text-gray-600 mt-2">
                                Manage your groups efficiently. Create, view, and organize groups with ease.
                            </p>
                        </div>
                        <Button
                            className="bg-[#41b658] hover:bg-[#41b658]/90 text-white flex items-center"
                            onClick={() => {
                                setIsCreating(true);
                                setIsSuccess(false); // Reset success state
                            }}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Group
                        </Button>
                    </div>
                </div>

                {/* Group Creation Section */}
                {isCreating && (
                    <Card className="p-6 bg-white/10 backdrop-blur-lg border-[1.5px] rounded-lg mb-6">
                        {isSuccess ? (
                            <SuccessMessage onReset={() => setIsCreating(false)} />
                        ) : (
                            <GroupForm
                                onSuccess={() => {
                                    setIsSuccess(true); // Show success message
                                    setIsCreating(false); // Hide form after success
                                }}
                            />
                        )}
                    </Card>
                )}

                {/* Groups List Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#41b658]">All Groups</h2>
                    <p className="text-gray-600 mb-4">
                        Below is a list of all your groups. You can view members or create a new group.
                    </p>
                    {isLoading ? (
                        <p className="text-black/80">Loading groups...</p>
                    ) : groups.length === 0 ? (
                        <p className="text-black/80">No groups found. Create a new group to get started.</p>
                    ) : (
                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <Table className="min-w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-lg font-semibold text-gray-700 p-2 text-left">
                                            Sr.no
                                        </TableHead>
                                        <TableHead className="text-lg font-semibold text-gray-700 p-4 text-left">
                                            Group Name
                                        </TableHead>
                                        <TableHead className="text-lg font-semibold text-gray-700 p-4 text-left">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="bg-white">
                                    {groups.map((group, index) => (
                                        <TableRow key={group.id} className="hover:bg-gray-50 cursor-pointer">
                                            <TableCell className="text-base text-black font-medium p-4">
                                                {index + 1} {/* Display Sr.no in ascending order */}
                                            </TableCell>
                                            <TableCell className="text-base text-black font-medium p-4">
                                                {group.groupName}
                                            </TableCell>
                                            <TableCell className="p-2">
                                                <Button
                                                    variant="outline"
                                                    className="text-black hover:bg-[#41b658] hover:text-white"
                                                    onClick={() => {
                                                        setSelectedGroup(group);
                                                        console.log('Selected Group:', group); // Debug log
                                                    }}
                                                >
                                                    View Members
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                {/* Group Members Modal */}
                {selectedGroup && (
                    <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-[#41b658]">
                                    Group: {selectedGroup.groupName}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                {selectedGroup.contacts.length === 0 ? (
                                    <p className="text-black/80 text-center">No members found in this group.</p>
                                ) : (
                                    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                                        <Table className="min-w-full">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="text-gray-700 p-4 text-left">Name</TableHead>
                                                    <TableHead className="text-gray-700 p-4 text-left">Phone</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="bg-white">
                                                {selectedGroup.contacts.map((contact, index) => (
                                                    <TableRow key={index} className="even:bg-gray-50">
                                                        <TableCell className="text-black font-medium p-4">
                                                            {contact.name}
                                                        </TableCell>
                                                        <TableCell className="text-black p-4">
                                                            {contact.phone}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    className="text-black hover:bg-[#41b658] hover:text-white mt-4 w-full"
                                    onClick={() => setSelectedGroup(null)}
                                >
                                    Close
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}