import { useState } from "react";
import { Service } from "../types";

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      title: "Техническое обслуживание",
      description: "Профессиональный сервис с гарантией качества",
      price: 2500,
      duration: "2-3 часа",
      icon: "Settings",
      available: true,
    },
    {
      id: "2",
      title: "Диагностика двигателя",
      description: "Компьютерная диагностика всех систем",
      price: 1200,
      duration: "1 час",
      icon: "Search",
      available: true,
    },
  ]);

  const saveService = (service: Service) => {
    if (service.id) {
      setServices(services.map((s) => (s.id === service.id ? service : s)));
    } else {
      setServices([...services, { ...service, id: Date.now().toString() }]);
    }
  };

  const deleteService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  return {
    services,
    saveService,
    deleteService,
  };
};
