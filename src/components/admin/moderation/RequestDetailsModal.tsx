import React from "react";
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

interface RequestDetailsModalProps {
  request: OrganizationRequest;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  actionLoading: boolean;
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

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  request,
  onClose,
  onApprove,
  onReject,
  actionLoading
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Icon name={getOrgTypeIcon(request.organization_type)} className="h-8 w-8 text-[#004488] mt-1" />
              <div>
                <h2 className="text-2xl font-bold">{request.organization_name}</h2>
                <p className="text-muted-foreground">{getOrgTypeText(request.organization_type)}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" className="h-5 w-5" />
            </Button>
          </div>

          <Badge className={`${getStatusColor(request.status)} text-white`}>
            {getStatusText(request.status)}
          </Badge>

          <div className="space-y-4 pt-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="User" className="h-4 w-4" />
                Заявитель
              </h3>
              <div className="space-y-1 text-sm text-muted-foreground pl-6">
                <p>Имя: {request.user_name}</p>
                <p>Email: {request.user_email}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="FileText" className="h-4 w-4" />
                Описание
              </h3>
              <p className="text-sm text-muted-foreground pl-6">{request.description}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Info" className="h-4 w-4" />
                Контактная информация
              </h3>
              <div className="space-y-2 text-sm pl-6">
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" className="h-4 w-4 text-muted-foreground" />
                  <span>{request.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Phone" className="h-4 w-4 text-muted-foreground" />
                  <span>{request.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Mail" className="h-4 w-4 text-muted-foreground" />
                  <span>{request.email}</span>
                </div>
                {request.website && (
                  <div className="flex items-center gap-2">
                    <Icon name="Globe" className="h-4 w-4 text-muted-foreground" />
                    <a href={request.website} target="_blank" rel="noopener noreferrer" className="text-[#004488] hover:underline">
                      {request.website}
                    </a>
                  </div>
                )}
                {request.working_hours && (
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" className="h-4 w-4 text-muted-foreground" />
                    <span>{request.working_hours}</span>
                  </div>
                )}
              </div>
            </div>

            {request.additional_info && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="FileText" className="h-4 w-4" />
                  Дополнительная информация
                </h3>
                <p className="text-sm text-muted-foreground pl-6">{request.additional_info}</p>
              </div>
            )}

            {request.review_comment && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Комментарий модератора</h3>
                <p className="text-sm text-muted-foreground">{request.review_comment}</p>
              </div>
            )}

            <div className="text-xs text-muted-foreground pt-2 border-t">
              Заявка создана: {new Date(request.created_at).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
            </div>
          </div>

          {request.status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={onApprove}
                disabled={actionLoading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Обработка...
                  </>
                ) : (
                  <>
                    <Icon name="Check" className="h-4 w-4 mr-2" />
                    Одобрить
                  </>
                )}
              </Button>
              <Button
                onClick={onReject}
                disabled={actionLoading}
                variant="destructive"
                className="flex-1"
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Обработка...
                  </>
                ) : (
                  <>
                    <Icon name="X" className="h-4 w-4 mr-2" />
                    Отклонить
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
