import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserOrder } from "@/types/user";

interface OrdersTabProps {
  orders: UserOrder[];
}

const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-white">История заказов</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div key={index} className="border border-zinc-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-accent font-medium">
                  {order.id}
                </span>
                <Badge
                  variant={
                    order.status === "Доставлен" ? "default" : "secondary"
                  }
                  className={
                    order.status === "Доставлен"
                      ? "bg-green-600"
                      : "bg-blue-600"
                  }
                >
                  {order.status}
                </Badge>
              </div>
              <div className="text-white font-medium mb-1">{order.item}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{order.date}</span>
                <span className="text-accent font-semibold">{order.price}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersTab;
