import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Icon from "@/components/ui/icon";

interface AdminModerationProps {
  pendingItems: any[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "product":
      return "Package";
    case "service":
      return "Wrench";
    case "event":
      return "Calendar";
    default:
      return "FileText";
  }
};

const getTypeText = (type: string) => {
  switch (type) {
    case "product":
      return "Товар";
    case "service":
      return "Услуга";
    case "event":
      return "Событие";
    default:
      return "Объявление";
  }
};

export const AdminModeration: React.FC<AdminModerationProps> = ({ 
  pendingItems, 
  onApprove, 
  onReject 
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Элементы на модерации</CardTitle>
          <p className="text-sm text-muted-foreground">
            Проверьте и одобрите новые товары, услуги и события
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Тип</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Icon
                        name={getTypeIcon(item.type)}
                        className="h-4 w-4"
                      />
                      <span>{getTypeText(item.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.author}</TableCell>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString("ru-RU")}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onApprove(item.id)}
                        className="text-green-600 hover:bg-green-50"
                      >
                        <Icon name="Check" className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReject(item.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Icon name="X" className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
