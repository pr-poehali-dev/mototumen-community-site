import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface OrganizationRequest {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  organization_name: string;
  organization_type: 'shop' | 'service' | 'school';
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  working_hours?: string;
  additional_info?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  review_comment?: string;
}

interface OrganizationRequestCardProps {
  request: OrganizationRequest;
  onViewDetails: (request: OrganizationRequest) => void;
  onArchive: (requestId: number) => void;
  archiveLoading: boolean;
  isCEO: boolean;
}

const getOrgTypeIcon = (type: string) => {
  switch (type) {
    case "shop":
      return "Store";
    case "service":
      return "Wrench";
    case "school":
      return "GraduationCap";
    default:
      return "Building2";
  }
};

const getOrgTypeText = (type: string) => {
  switch (type) {
    case "shop":
      return "Магазин";
    case "service":
      return "Сервис";
    case "school":
      return "Мотошкола";
    default:
      return "Организация";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "approved":
      return "bg-green-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "На рассмотрении";
    case "approved":
      return "Одобрена";
    case "rejected":
      return "Отклонена";
    default:
      return status;
  }
};

export const OrganizationRequestCard: React.FC<OrganizationRequestCardProps> = ({
  request,
  onViewDetails,
  onArchive,
  archiveLoading,
  isCEO
}) => {
  return (
    <Card key={request.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Icon name={getOrgTypeIcon(request.organization_type)} className="h-6 w-6 text-[#004488] mt-1" />
            <div>
              <CardTitle className="text-lg">{request.organization_name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getOrgTypeText(request.organization_type)}
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor(request.status)} text-white`}>
            {getStatusText(request.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Icon name="User" className="h-4 w-4 text-muted-foreground" />
            <span>{request.user_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Mail" className="h-4 w-4 text-muted-foreground" />
            <span>{request.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Phone" className="h-4 w-4 text-muted-foreground" />
            <span>{request.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="MapPin" className="h-4 w-4 text-muted-foreground" />
            <span>{request.address}</span>
          </div>
        </div>

        <div className="pt-3 border-t flex gap-2 flex-wrap">
          <Button 
            onClick={() => onViewDetails(request)}
            className="flex-1 sm:flex-none"
          >
            <Icon name="Eye" className="h-4 w-4 mr-2" />
            Подробнее
          </Button>
          
          {isCEO && (request.status === 'approved' || request.status === 'rejected') && (
            <Button
              variant="outline"
              onClick={() => onArchive(request.id)}
              disabled={archiveLoading}
              className="flex-1 sm:flex-none"
            >
              {archiveLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Архивирую...
                </>
              ) : (
                <>
                  <Icon name="Archive" className="h-4 w-4 mr-2" />
                  В архив
                </>
              )}
            </Button>
          )}
        </div>

        {request.review_comment && (
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Комментарий модератора:</p>
            <p className="text-sm text-muted-foreground">{request.review_comment}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
