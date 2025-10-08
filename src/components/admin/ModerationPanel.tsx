import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Complaint {
  id: string;
  reporterId: string;
  reporterName: string;
  targetUserId: string;
  targetUserName: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: string;
}

const ModerationPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: '1',
      reporterId: '2',
      reporterName: 'Иван Петров',
      targetUserId: '3',
      targetUserName: 'Мария Сидорова',
      reason: 'Спам',
      description: 'Постоянно отправляет спам в комментариях',
      status: 'pending',
      createdAt: '2024-10-09T10:00:00',
    },
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [actionNote, setActionNote] = useState('');

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailDialogOpen(true);
    setActionNote('');
  };

  const handleResolveComplaint = (action: 'block' | 'warn' | 'reject') => {
    if (selectedComplaint) {
      setComplaints(complaints.map(c => 
        c.id === selectedComplaint.id 
          ? { ...c, status: action === 'reject' ? 'rejected' : 'resolved' } 
          : c
      ));
      setIsDetailDialogOpen(false);
      setSelectedComplaint(null);
      setActionNote('');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-600">На рассмотрении</Badge>;
      case 'resolved':
        return <Badge className="bg-green-600">Решена</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600">Отклонена</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="ghost" size="sm">
          <Icon name="ArrowLeft" className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <h3 className="text-xl font-bold text-white">Модерация и жалобы</h3>
        <div className="w-20" />
      </div>

      <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-700 hover:bg-zinc-800">
              <TableHead className="text-zinc-400">Жалоба от</TableHead>
              <TableHead className="text-zinc-400">На пользователя</TableHead>
              <TableHead className="text-zinc-400">Причина</TableHead>
              <TableHead className="text-zinc-400">Дата</TableHead>
              <TableHead className="text-zinc-400">Статус</TableHead>
              <TableHead className="text-zinc-400">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id} className="border-zinc-700 hover:bg-zinc-700/50">
                <TableCell className="text-white">{complaint.reporterName}</TableCell>
                <TableCell className="text-white">{complaint.targetUserName}</TableCell>
                <TableCell className="text-zinc-400">{complaint.reason}</TableCell>
                <TableCell className="text-zinc-400">
                  {new Date(complaint.createdAt).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewComplaint(complaint)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                  >
                    <Icon name="Eye" className="h-4 w-4 mr-1" />
                    Просмотр
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Детали жалобы</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Рассмотрите жалобу и примите решение
            </DialogDescription>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Жалобу подал:</p>
                  <p className="text-white font-semibold">{selectedComplaint.reporterName}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">На пользователя:</p>
                  <p className="text-white font-semibold">{selectedComplaint.targetUserName}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-zinc-400 mb-1">Причина:</p>
                <p className="text-white">{selectedComplaint.reason}</p>
              </div>

              <div>
                <p className="text-sm text-zinc-400 mb-1">Описание:</p>
                <p className="text-white bg-zinc-800 p-3 rounded-md">{selectedComplaint.description}</p>
              </div>

              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Примечание (необязательно):</label>
                <Textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Добавьте комментарий к решению..."
                  className="bg-zinc-800 border-zinc-700 text-white"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button 
              variant="ghost" 
              onClick={() => handleResolveComplaint('reject')}
              className="text-zinc-400 hover:text-white"
            >
              Отклонить жалобу
            </Button>
            <Button 
              onClick={() => handleResolveComplaint('warn')}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Icon name="AlertTriangle" className="h-4 w-4 mr-2" />
              Предупредить
            </Button>
            <Button 
              onClick={() => handleResolveComplaint('block')}
              className="bg-red-600 hover:bg-red-700"
            >
              <Icon name="Ban" className="h-4 w-4 mr-2" />
              Заблокировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModerationPanel;
