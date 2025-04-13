"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignList = CampaignList;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const button_1 = require("@/components/ui/button");
const date_fns_1 = require("date-fns");
const lucide_react_1 = require("lucide-react");
const StatusIcon = ({ status }) => {
    switch (status) {
        case 'sent':
            return <lucide_react_1.CheckCircle className="h-4 w-4 text-green-500"/>;
        case 'scheduled':
            return <lucide_react_1.Clock className="h-4 w-4 text-blue-500"/>;
        case 'failed':
            return <lucide_react_1.AlertCircle className="h-4 w-4 text-red-500"/>;
        default:
            return <lucide_react_1.RefreshCw className="h-4 w-4 text-gray-500"/>;
    }
};
function CampaignList({ onDuplicate, onEdit, onView }) {
    const [campaigns, setCampaigns] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch('/api/Whatsapp/campaign');
                if (!response.ok) {
                    throw new Error('Failed to fetch campaigns');
                }
                const data = await response.json();
                setCampaigns(data);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);
    if (loading) {
        return <div className="text-black">Loading campaigns...</div>;
    }
    if (campaigns.length === 0) {
        return <div className="text-black">No campaigns found.</div>;
    }
    return (<div className="space-y-4">
      <div className='flex flex-col gap-1'>
        <h2 className="text-2xl font-semibold text-black">Campaigns</h2>
        <p className="text-black/70">
          Manage your campaigns, view their status, and take actions like editing or duplicating.
        </p>
      </div>


      <div className="space-y-4">
        {campaigns.map((campaign) => (<card_1.Card key={campaign.id} className="bg-white border border-gray-200 shadow-sm">
            <card_1.CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <card_1.CardTitle className="text-lg font-medium text-black">
                    {campaign.name}
                  </card_1.CardTitle>
                  <card_1.CardDescription className="text-black/60">
                    Created {(0, date_fns_1.format)(new Date(campaign.createdAt), 'PPP')}
                  </card_1.CardDescription>
                </div>
                <dropdown_menu_1.DropdownMenu>
                  <dropdown_menu_1.DropdownMenuTrigger asChild>
                    <button_1.Button variant="ghost" className="h-8 w-8 p-0">
                      <lucide_react_1.MoreVertical className="h-4 w-4 text-black"/>
                    </button_1.Button>
                  </dropdown_menu_1.DropdownMenuTrigger>
                  <dropdown_menu_1.DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                    <dropdown_menu_1.DropdownMenuItem onClick={() => onView(campaign.id)} className="text-black hover:bg-[#41b658]/10 focus:bg-[#41b658]/10">
                      <lucide_react_1.Eye className="mr-2 h-4 w-4"/>
                      View Details
                    </dropdown_menu_1.DropdownMenuItem>
                    <dropdown_menu_1.DropdownMenuItem onClick={() => onEdit(campaign.id)} className="text-black hover:bg-[#41b658]/10 focus:bg-[#41b658]/10">
                      <lucide_react_1.Edit className="mr-2 h-4 w-4"/>
                      Edit
                    </dropdown_menu_1.DropdownMenuItem>
                    <dropdown_menu_1.DropdownMenuItem onClick={() => onDuplicate(campaign.id)} className="text-black hover:bg-[#41b658]/10 focus:bg-[#41b658]/10">
                      <lucide_react_1.Copy className="mr-2 h-4 w-4"/>
                      Duplicate
                    </dropdown_menu_1.DropdownMenuItem>
                  </dropdown_menu_1.DropdownMenuContent>
                </dropdown_menu_1.DropdownMenu>
              </div>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="space-y-2 text-black/80">
                  <div>Template: {campaign.templateName}</div>
                  <div>Group: {campaign.groupName}</div>
                  {campaign.scheduledFor && (<div>
                      Scheduled for:{' '}
                      {(0, date_fns_1.format)(new Date(campaign.scheduledFor), 'PPP HH:mm')}
                    </div>)}
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon status={campaign.status}/>
                  <span className="text-sm capitalize text-black/80">
                    {campaign.status}
                  </span>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>))}
      </div>
    </div>);
}
