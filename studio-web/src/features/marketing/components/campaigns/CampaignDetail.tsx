import { useParams, useNavigate } from 'react-router-dom';
import { useCampaigns } from '../../hooks/useCampaigns';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { StatusBadge } from '../shared/StatusBadge';
import { ArrowLeft, Send } from 'lucide-react';
import { usePostApiMarketingRecipientsIdSend } from '@/api/hooks/api';
import { useQueryClient } from '@tanstack/react-query';
import { AddUsersDialog } from './AddUsersDialog';
import { toast } from '@/shared/components/ui/use-toast';
import { useState } from 'react';

export const CampaignDetail = () => {
  const queryClient = useQueryClient();
  const sendEmail = usePostApiMarketingRecipientsIdSend({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      }
    }
  });

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaigns, isLoading } = useCampaigns();
  const [sendingProgress, setSendingProgress] = useState<{ total: number; current: number } | null>(null);
  const campaign = campaigns.find((c) => c.id === id);

  if (isLoading) {
    return <div className="text-muted-foreground">Loading campaign...</div>;
  }

  if (!campaign) {
    return <div>Campaign not found</div>;
  }


  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSendCampaign = async () => {
    if (!campaign?.recipients) return;

    // Filter recipients that haven't been sent to yet
    const pendingRecipients = campaign.recipients.filter(r => !r.sentAt);
    if (pendingRecipients.length === 0) {
      toast({
        title: "No pending emails",
        description: "All emails in this campaign have already been sent.",
      });
      return;
    }

    // Ask for confirmation
    if (!window.confirm(`Send ${pendingRecipients.length} emails with a 500ms delay between each?`)) {
      return;
    }

    setSendingProgress({ total: pendingRecipients.length, current: 0 });

    // Send emails sequentially with delay
    for (let i = 0; i < pendingRecipients.length; i++) {
      const recipient = pendingRecipients[i];
      if (recipient?.id) {
        try {
          await sendEmail.mutateAsync({ id: recipient.id });
          setSendingProgress(prev => prev ? { ...prev, current: prev.current + 1 } : null);
          if (i < pendingRecipients.length - 1) { // Don't wait after the last email
            await sleep(1500);
          }
        } catch (error) {
          console.error(`Failed to send email to ${recipient.email}:`, error);
          toast({
            title: "Error",
            description: `Failed to send email to ${recipient.email}. Continuing with remaining emails...`,
            variant: "destructive",
          });
          await sleep(1500); // Still wait before next attempt
        }
      }
    }

    setSendingProgress(null);
    toast({
      title: "Campaign sent",
      description: `Finished sending ${pendingRecipients.length} emails.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" onClick={() => navigate('/studio/marketing/campaigns')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{campaign.name}</h1>
          <p className="text-gray-500">{campaign.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => handleSendCampaign()}
            disabled={sendEmail.isPending}
          >
            <Send className="h-4 w-4 mr-2" />
            {sendingProgress 
              ? `Sending ${sendingProgress.current}/${sendingProgress.total}...`
              : 'Send Campaign'}
          </Button>
          <AddUsersDialog 
            campaignId={id!} 
            onUsersAdded={() => queryClient.invalidateQueries({ queryKey: ['campaigns'] })} 
          />
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
          <TabsTrigger value="template">Template</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recipients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaign.recipients?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Open Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Click Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recipients">
          <Card>
            <CardHeader>
              <CardTitle>Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              {campaign.recipients?.length ? (
                <div className="space-y-4">
                  {campaign.recipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{recipient.email}</div>
                        <div className="text-sm text-muted-foreground">
                          Added {recipient.createdAt ? new Date(recipient.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={recipient.status} />
                        {recipient.sentAt ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div>Sent {new Date(recipient.sentAt).toLocaleDateString()}</div>
                            {recipient.openedAt && (
                              <div className="flex items-center gap-1">
                                <span>•</span>
                                <span>Opened {new Date(recipient.openedAt).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (recipient.id) {
                                sendEmail.mutate({ id: recipient.id });
                              }
                            }}
                            disabled={sendEmail.isPending}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No recipients added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template">
          <Card>
            <CardHeader>
              <CardTitle>Email Template</CardTitle>
            </CardHeader>
            <CardContent>
              {campaign.emailTemplate ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold">{campaign.emailTemplate.name}</h3>
                    <p className="text-muted-foreground">{campaign.emailTemplate.subject}</p>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
                    <div className="p-2 bg-secondary text-secondary-foreground text-sm font-medium border-b flex items-center justify-between">
                      <span>Email Preview</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`data:text/html;charset=utf-8,${encodeURIComponent(campaign.emailTemplate?.htmlContent || '')}`, '_blank')}
                      >
                        Open in New Tab
                      </Button>
                    </div>
                    <div className="p-4">
                      <iframe
                        srcDoc={campaign.emailTemplate.htmlContent}
                        className="w-full h-[600px] border-0 rounded bg-white"
                        sandbox="allow-same-origin"
                        title="Email Preview"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No template selected</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No data available yet</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
