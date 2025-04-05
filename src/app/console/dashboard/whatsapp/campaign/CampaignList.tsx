'use client';

import { useEffect, useState } from 'react';
import { Campaign } from './types'; // Define your Campaign type
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
  Copy,
  Edit,
  Eye,
  MoreVertical,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

const StatusIcon = ({ status }: { status: Campaign['status'] }) => {
  switch (status) {
    case 'sent':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'scheduled':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'failed':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <RefreshCw className="h-4 w-4 text-gray-500" />;
  }
};

interface CampaignListProps {
  onDuplicate: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

export function CampaignList({ onDuplicate, onEdit, onView }: CampaignListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/Whatsapp/campaign');
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        const data: Campaign[] = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error(error);
      } finally {
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

  return (
    <div className="space-y-4">
      <div className='flex flex-col gap-1'>
        <h2 className="text-2xl font-semibold text-black">Campaigns</h2>
        <p className="text-black/70">
          Manage your campaigns, view their status, and take actions like editing or duplicating.
        </p>
      </div>


      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className="bg-white border border-gray-200 shadow-sm"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-medium text-black">
                    {campaign.name}
                  </CardTitle>
                  <CardDescription className="text-black/60">
                    Created {format(new Date(campaign.createdAt), 'PPP')}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4 text-black" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-white border border-gray-200 shadow-lg"
                  >
                    <DropdownMenuItem
                      onClick={() => onView(campaign.id)}
                      className="text-black hover:bg-[#41b658]/10 focus:bg-[#41b658]/10"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEdit(campaign.id)}
                      className="text-black hover:bg-[#41b658]/10 focus:bg-[#41b658]/10"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDuplicate(campaign.id)}
                      className="text-black hover:bg-[#41b658]/10 focus:bg-[#41b658]/10"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="space-y-2 text-black/80">
                  <div>Template: {campaign.templateName}</div>
                  <div>Group: {campaign.groupName}</div>
                  {campaign.scheduledFor && (
                    <div>
                      Scheduled for:{' '}
                      {format(new Date(campaign.scheduledFor), 'PPP HH:mm')}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon status={campaign.status} />
                  <span className="text-sm capitalize text-black/80">
                    {campaign.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}