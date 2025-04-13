"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GroupPage;
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const card_1 = require("@/components/ui/card");
const GroupForm_1 = require("./GroupForm");
const SuccessMessage_1 = require("./SuccessMessage");
const button_1 = require("@/components/ui/button");
const dialog_1 = require("@/components/ui/dialog");
const table_1 = require("@/components/ui/table"); // Import shadcn table components
const react_toastify_1 = require("react-toastify"); // Import react-toastify
require("react-toastify/dist/ReactToastify.css"); // Import react-toastify styles
function GroupPage() {
    const [isCreating, setIsCreating] = (0, react_1.useState)(false); // Toggle form visibility
    const [isSuccess, setIsSuccess] = (0, react_1.useState)(false); // Success state for group creation
    const [groups, setGroups] = (0, react_1.useState)([]); // Store groups
    const [isLoading, setIsLoading] = (0, react_1.useState)(true); // Loading state for groups
    const [selectedGroup, setSelectedGroup] = (0, react_1.useState)(null); // Selected group for popup
    // Fetch groups from the database
    (0, react_1.useEffect)(() => {
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
            }
            catch (error) {
                react_toastify_1.toast.error('Unable to fetch groups. Please try again later.'); // Use react-toastify's toast
            }
            finally {
                setIsLoading(false); // Remove loading state
            }
        };
        fetchGroups();
    }, [isSuccess]); // Re-fetch groups after a successful creation
    return (<div className="min-h-screen bg-[#ffffff] text-black p-6">
            <react_toastify_1.ToastContainer /> {/* Add ToastContainer to render toasts */}
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
                        <button_1.Button className="bg-[#41b658] hover:bg-[#41b658]/90 text-white flex items-center" onClick={() => {
            setIsCreating(true);
            setIsSuccess(false); // Reset success state
        }}>
                            <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
                            Create Group
                        </button_1.Button>
                    </div>
                </div>

                {/* Group Creation Section */}
                {isCreating && (<card_1.Card className="p-6 bg-white/10 backdrop-blur-lg border-[1.5px] rounded-lg mb-6">
                        {isSuccess ? (<SuccessMessage_1.SuccessMessage onReset={() => setIsCreating(false)}/>) : (<GroupForm_1.GroupForm onSuccess={() => {
                    setIsSuccess(true); // Show success message
                    setIsCreating(false); // Hide form after success
                }}/>)}
                    </card_1.Card>)}

                {/* Groups List Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#41b658]">All Groups</h2>
                    <p className="text-gray-600 mb-4">
                        Below is a list of all your groups. You can view members or create a new group.
                    </p>
                    {isLoading ? (<p className="text-black/80">Loading groups...</p>) : groups.length === 0 ? (<p className="text-black/80">No groups found. Create a new group to get started.</p>) : (<div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table_1.Table className="min-w-full">
                                <table_1.TableHeader>
                                    <table_1.TableRow>
                                        <table_1.TableHead className="text-lg font-semibold text-gray-700 p-2 text-left">
                                            Sr.no
                                        </table_1.TableHead>
                                        <table_1.TableHead className="text-lg font-semibold text-gray-700 p-4 text-left">
                                            Group Name
                                        </table_1.TableHead>
                                        <table_1.TableHead className="text-lg font-semibold text-gray-700 p-4 text-left">
                                            Actions
                                        </table_1.TableHead>
                                    </table_1.TableRow>
                                </table_1.TableHeader>
                                <table_1.TableBody className="bg-white">
                                    {groups.map((group, index) => (<table_1.TableRow key={group.id} className="hover:bg-gray-50 cursor-pointer">
                                            <table_1.TableCell className="text-base text-black font-medium p-4">
                                                {index + 1} {/* Display Sr.no in ascending order */}
                                            </table_1.TableCell>
                                            <table_1.TableCell className="text-base text-black font-medium p-4">
                                                {group.groupName}
                                            </table_1.TableCell>
                                            <table_1.TableCell className="p-2">
                                                <button_1.Button variant="outline" className="text-black hover:bg-[#41b658] hover:text-white" onClick={() => {
                    setSelectedGroup(group);
                    console.log('Selected Group:', group); // Debug log
                }}>
                                                    View Members
                                                </button_1.Button>
                                            </table_1.TableCell>
                                        </table_1.TableRow>))}
                                </table_1.TableBody>
                            </table_1.Table>
                        </div>)}
                </div>

                {/* Group Members Modal */}
                {selectedGroup && (<dialog_1.Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
                        <dialog_1.DialogContent>
                            <dialog_1.DialogHeader>
                                <dialog_1.DialogTitle className="text-[#41b658]">
                                    Group: {selectedGroup.groupName}
                                </dialog_1.DialogTitle>
                            </dialog_1.DialogHeader>
                            <div className="space-y-4">
                                {selectedGroup.contacts.length === 0 ? (<p className="text-black/80 text-center">No members found in this group.</p>) : (<div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                                        <table_1.Table className="min-w-full">
                                            <table_1.TableHeader>
                                                <table_1.TableRow>
                                                    <table_1.TableHead className="text-gray-700 p-4 text-left">Name</table_1.TableHead>
                                                    <table_1.TableHead className="text-gray-700 p-4 text-left">Phone</table_1.TableHead>
                                                </table_1.TableRow>
                                            </table_1.TableHeader>
                                            <table_1.TableBody className="bg-white">
                                                {selectedGroup.contacts.map((contact, index) => (<table_1.TableRow key={index} className="even:bg-gray-50">
                                                        <table_1.TableCell className="text-black font-medium p-4">
                                                            {contact.name}
                                                        </table_1.TableCell>
                                                        <table_1.TableCell className="text-black p-4">
                                                            {contact.phone}
                                                        </table_1.TableCell>
                                                    </table_1.TableRow>))}
                                            </table_1.TableBody>
                                        </table_1.Table>
                                    </div>)}
                                <button_1.Button variant="outline" className="text-black hover:bg-[#41b658] hover:text-white mt-4 w-full" onClick={() => setSelectedGroup(null)}>
                                    Close
                                </button_1.Button>
                            </div>
                        </dialog_1.DialogContent>
                    </dialog_1.Dialog>)}
            </div>
        </div>);
}
