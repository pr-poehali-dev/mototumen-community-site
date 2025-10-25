import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAuth } from "@/contexts/AuthContext";

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

interface AdminModerationProps {
  pendingItems: any[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const ADMIN_API = 'https://functions.poehali.dev/a4bf4de7-33a4-406c-95cc-0529c16d6677';

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

export const AdminModeration: React.FC<AdminModerationProps> = ({ 
  pendingItems, 
  onApprove, 
  onReject 
}) => {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState<OrganizationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<OrganizationRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState<number | null>(null);

  const isCEO = user?.role === 'ceo';

  useEffect(() => {
    if (!isCEO || !token) {
      setLoading(false);
      return;
    }
    
    loadRequests();
  }, [isCEO, token]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ADMIN_API}?action=organization-requests`, {
        headers: { 'X-Auth-Token': token || '' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Failed to load organization requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async () => {
    if (!selectedRequest) return;
    
    setActionLoading(true);
    try {
      const response = await fetch(`${ADMIN_API}?action=organization-request`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify({
          request_id: selectedRequest.id,
          status: 'approved'
        })
      });

      if (response.ok) {
        await loadRequests();
        setShowModal(false);
        setSelectedRequest(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка при одобрении заявки');
      }
    } catch (error) {
      console.error('Failed to approve request:', error);
      alert('Не удалось одобрить заявку');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest) return;
    
    const comment = prompt('Причина отклонения (необязательно):');
    
    setActionLoading(true);
    try {
      const response = await fetch(`${ADMIN_API}?action=organization-request`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify({
          request_id: selectedRequest.id,
          status: 'rejected',
          review_comment: comment || ''
        })
      });

      if (response.ok) {
        await loadRequests();
        setShowModal(false);
        setSelectedRequest(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка при отклонении заявки');
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      alert('Не удалось отклонить заявку');
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchiveRequest = async (requestId: number) => {
    if (!isCEO) return;
    
    if (!confirm('Переместить заявку в архив?')) return;
    
    setArchiveLoading(requestId);
    try {
      const response = await fetch(`${ADMIN_API}?action=organization-request`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify({
          request_id: requestId,
          status: 'archived'
        })
      });

      if (response.ok) {
        await loadRequests();
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка при архивации заявки');
      }
    } catch (error) {
      console.error('Failed to archive request:', error);
      alert('Не удалось архивировать заявку');
    } finally {
      setArchiveLoading(null);
    }
  };

  const getPendingCount = (type: string) => {
    if (type === 'all') {
      return requests.filter(r => r.status === 'pending').length;
    }
    return requests.filter(r => r.status === 'pending' && r.organization_type === type).length;
  };

  const getFilteredRequests = () => {
    if (selectedFilter === 'all') {
      return requests;
    }
    return requests.filter(r => r.organization_type === selectedFilter);
  };

  if (!isCEO) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Icon name="Lock" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Только CEO имеет доступ к модерации организаций</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004488] mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка заявок...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap mb-4">
        <Button
          variant={selectedFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('all')}
          className="relative"
        >
          <Icon name="Building2" className="h-4 w-4 mr-2" />
          Все
          {getPendingCount('all') > 0 && (
            <Badge className="ml-2 bg-red-500 text-white">
              {getPendingCount('all')}
            </Badge>
          )}
        </Button>
        
        <Button
          variant={selectedFilter === 'shop' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('shop')}
          className="relative"
        >
          <Icon name="Store" className="h-4 w-4 mr-2" />
          Магазины
          {getPendingCount('shop') > 0 && (
            <Badge className="ml-2 bg-red-500 text-white">
              {getPendingCount('shop')}
            </Badge>
          )}
        </Button>
        
        <Button
          variant={selectedFilter === 'service' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('service')}
          className="relative"
        >
          <Icon name="Wrench" className="h-4 w-4 mr-2" />
          Сервисы
          {getPendingCount('service') > 0 && (
            <Badge className="ml-2 bg-red-500 text-white">
              {getPendingCount('service')}
            </Badge>
          )}
        </Button>
        
        <Button
          variant={selectedFilter === 'school' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('school')}
          className="relative"
        >
          <Icon name="GraduationCap" className="h-4 w-4 mr-2" />
          Мотошколы
          {getPendingCount('school') > 0 && (
            <Badge className="ml-2 bg-red-500 text-white">
              {getPendingCount('school')}
            </Badge>
          )}
        </Button>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Заявки на регистрацию организаций</CardTitle>
          <p className="text-sm text-muted-foreground">
            Проверьте и одобрите заявки от организаций
          </p>
        </CardHeader>
        <CardContent>
          {getFilteredRequests().length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Inbox" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Нет заявок для отображения</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Тип</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Заявитель</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredRequests().map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Icon
                          name={getOrgTypeIcon(request.organization_type)}
                          className="h-4 w-4"
                        />
                        <span>{getOrgTypeText(request.organization_type)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{request.organization_name}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.user_name}</p>
                        <p className="text-xs text-gray-400">{request.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString("ru-RU")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          request.status === 'pending'
                            ? 'bg-yellow-500'
                            : request.status === 'approved'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }
                      >
                        {request.status === 'pending' ? 'На рассмотрении' : 
                         request.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                          }}
                        >
                          <Icon name="Eye" className="h-4 w-4 mr-1" />
                          Просмотр
                        </Button>
                        {isCEO && request.status !== 'pending' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleArchiveRequest(request.id)}
                            disabled={archiveLoading === request.id}
                          >
                            {archiveLoading === request.id ? (
                              <Icon name="Loader2" className="h-4 w-4 animate-spin" />
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
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <div className="bg-dark-800 border border-dark-600 rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedRequest(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <Icon name="X" size={24} />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Icon name={getOrgTypeIcon(selectedRequest.organization_type)} size={32} className="text-[#004488]" />
                <h2 className="text-2xl font-bold text-white">{selectedRequest.organization_name}</h2>
              </div>
              <Badge className={
                selectedRequest.status === 'pending'
                  ? 'bg-yellow-500'
                  : selectedRequest.status === 'approved'
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }>
                {getOrgTypeText(selectedRequest.organization_type)}
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-1">Описание</h3>
                <p className="text-white">{selectedRequest.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Адрес</h3>
                  <p className="text-white">{selectedRequest.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Телефон</h3>
                  <p className="text-white">{selectedRequest.phone}</p>
                </div>
              </div>

              {selectedRequest.email && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Email</h3>
                  <p className="text-white">{selectedRequest.email}</p>
                </div>
              )}

              {selectedRequest.website && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Веб-сайт</h3>
                  <a href={selectedRequest.website} target="_blank" rel="noopener noreferrer" className="text-[#004488] hover:underline">
                    {selectedRequest.website}
                  </a>
                </div>
              )}

              {selectedRequest.working_hours && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Часы работы</h3>
                  <p className="text-white">{selectedRequest.working_hours}</p>
                </div>
              )}

              {selectedRequest.additional_info && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">Дополнительная информация</h3>
                  <p className="text-white">{selectedRequest.additional_info}</p>
                </div>
              )}

              <div className="border-t border-dark-600 pt-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Заявитель</h3>
                <p className="text-white">{selectedRequest.user_name}</p>
                <p className="text-gray-400 text-sm">{selectedRequest.user_email}</p>
              </div>
            </div>

            {selectedRequest.status === 'pending' && (
              <div className="flex gap-4">
                <Button
                  onClick={handleApproveRequest}
                  disabled={actionLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {actionLoading ? (
                    <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                  ) : (
                    <Icon name="FileCheck" className="mr-2" size={20} />
                  )}
                  Подписать договор
                </Button>
                <Button
                  onClick={handleRejectRequest}
                  disabled={actionLoading}
                  variant="destructive"
                  className="flex-1"
                >
                  <Icon name="X" className="mr-2" size={20} />
                  Отклонить
                </Button>
              </div>
            )}

            {selectedRequest.status === 'approved' && (
              <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 text-center">
                <Icon name="CheckCircle2" className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-400 font-semibold">Заявка одобрена</p>
              </div>
            )}

            {selectedRequest.status === 'rejected' && (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="XCircle" className="h-6 w-6 text-red-500" />
                  <p className="text-red-400 font-semibold">Заявка отклонена</p>
                </div>
                {selectedRequest.review_comment && (
                  <p className="text-gray-400 text-sm">Причина: {selectedRequest.review_comment}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};