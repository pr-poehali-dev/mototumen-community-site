import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface RequestsTableProps {
  requests: OrganizationRequest[];
  onViewDetails: (request: OrganizationRequest) => void;
  onArchive: (requestId: number) => void;
  archiveLoading: number | null;
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

export const RequestsTable: React.FC<RequestsTableProps> = ({
  requests,
  onViewDetails,
  onArchive,
  archiveLoading,
  isCEO
}) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Тип</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Заявитель</TableHead>
            <TableHead>Контакты</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Icon name={getOrgTypeIcon(request.organization_type)} className="h-4 w-4" />
                  <span className="text-xs">{getOrgTypeText(request.organization_type)}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{request.organization_name}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="text-sm">{request.user_name}</p>
                  <p className="text-xs text-muted-foreground">{request.user_email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1 text-xs">
                  <p>{request.phone}</p>
                  <p className="text-muted-foreground">{request.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusColor(request.status)} text-white text-xs`}>
                  {getStatusText(request.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(request.created_at).toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(request)}
                  >
                    <Icon name="Eye" className="h-4 w-4" />
                  </Button>
                  
                  {isCEO && (request.status === 'approved' || request.status === 'rejected') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onArchive(request.id)}
                      disabled={archiveLoading === request.id}
                    >
                      {archiveLoading === request.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <Icon name="Archive" className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
