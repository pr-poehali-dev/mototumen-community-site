import { useState } from "react";
import { Advertisement } from "../types";

export const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([
    {
      id: "1",
      title: "Honda CBR600RR 2019",
      description: "Отличное состояние, один владелец",
      price: "₽450,000",
      type: "Продажа",
      category: "motorcycles",
      contact: "+7 (999) 123-45-67",
      active: true,
    },
    {
      id: "2",
      title: "Yamaha MT-07 2021",
      description: "Практически новый, пробег 2000 км",
      price: "₽520,000",
      type: "Продажа",
      category: "motorcycles",
      contact: "+7 (999) 765-43-21",
      active: true,
    },
  ]);

  const saveAdvertisement = (advertisement: Advertisement) => {
    if (advertisement.id) {
      setAdvertisements(
        advertisements.map((a) =>
          a.id === advertisement.id ? advertisement : a,
        ),
      );
    } else {
      setAdvertisements([
        ...advertisements,
        { ...advertisement, id: Date.now().toString() },
      ]);
    }
  };

  const deleteAdvertisement = (id: string) => {
    setAdvertisements(advertisements.filter((a) => a.id !== id));
  };

  return {
    advertisements,
    saveAdvertisement,
    deleteAdvertisement,
  };
};
