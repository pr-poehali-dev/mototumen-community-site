import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { Order } from "@/types/profile";

interface OrdersSectionProps {
  orders: Order[];
}

const OrdersSection: React.FC<OrdersSectionProps> = ({ orders }) => {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Ожидает";
      case "confirmed":
        return "Подтвержден";
      case "shipped":
        return "Отправлен";
      case "delivered":
        return "Доставлен";
      case "cancelled":
        return "Отменен";
      default:
        return "Неизвестно";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h3 className="text-lg sm:text-xl font-semibold">История заказов</h3>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Icon name="Download" className="h-4 w-4 mr-2" />
          Скачать отчет
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
            <Icon name="ShoppingBag" className="h-12 w-12 text-zinc-500 mb-4" />
            <p className="text-zinc-400 text-center">У вас пока нет заказов</p>
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Перейти в магазин
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <CardTitle className="text-base sm:text-lg">
                      Заказ #{order.id}
                    </CardTitle>
                    <p className="text-sm text-zinc-400 mt-1">
                      {formatDate(order.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Badge
                      className={`${getStatusColor(order.status)} text-white`}
                    >
                      {getStatusText(order.status)}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Icon name="Eye" className="h-4 w-4 mr-2" />
                      Подробнее
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-zinc-400">
                          Количество: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm sm:text-base text-white">
                          {formatPrice(item.price)} ₽
                        </p>
                        <p className="text-xs sm:text-sm text-zinc-400">
                          за единицу
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="bg-zinc-800" />
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-zinc-400">
                    Итого:
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-white">
                    {formatPrice(order.total)} ₽
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
