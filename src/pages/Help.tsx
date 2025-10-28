import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Help = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    motoModel: "",
    motoYear: "",
    motoPlate: "",
    problemDescription: "",
    location: "",
    phone: user?.phone || "",
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите, чтобы оставить заявку на помощь",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAuthenticated, navigate, toast]);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          }));
          setIsLoadingLocation(false);
          toast({
            title: "Геолокация получена",
            description: "Координаты добавлены в заявку",
          });
        },
        (error) => {
          setIsLoadingLocation(false);
          toast({
            title: "Ошибка геолокации",
            description: "Не удалось получить координаты. Укажите адрес вручную.",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsLoadingLocation(false);
      toast({
        title: "Геолокация недоступна",
        description: "Ваш браузер не поддерживает геолокацию",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.motoModel || !formData.problemDescription || !formData.location) {
      toast({
        title: "Заполните все поля",
        description: "Модель мотоцикла, описание проблемы и местоположение обязательны",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в ближайшее время",
    });

    setFormData({
      motoModel: "",
      motoYear: "",
      motoPlate: "",
      problemDescription: "",
      location: "",
      phone: user?.phone || "",
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Заявка на помощь</h1>
          <p className="text-muted-foreground mb-8">
            Заполните форму, и мы организуем помощь на дороге
          </p>

          <div className="bg-card rounded-xl p-6 border-2 border-orange/30 shadow-lg mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="User" className="w-6 h-6 text-orange" />
              <h2 className="text-xl font-bold">Ваши данные</h2>
            </div>
            <div className="space-y-2">
              <p className="text-foreground"><span className="text-muted-foreground">Имя:</span> {user?.name}</p>
              <p className="text-foreground"><span className="text-muted-foreground">Телефон:</span> {user?.phone || "Не указан"}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card rounded-xl p-6 border-2 border-orange/30 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="Bike" className="w-6 h-6 text-orange" />
                <h2 className="text-xl font-bold">Данные мотоцикла</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="motoModel">Модель мотоцикла *</Label>
                  <Input
                    id="motoModel"
                    placeholder="Например: Honda CB650R"
                    value={formData.motoModel}
                    onChange={(e) => setFormData({...formData, motoModel: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="motoYear">Год выпуска</Label>
                    <Input
                      id="motoYear"
                      placeholder="2023"
                      value={formData.motoYear}
                      onChange={(e) => setFormData({...formData, motoYear: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="motoPlate">Гос. номер</Label>
                    <Input
                      id="motoPlate"
                      placeholder="А123БВ72"
                      value={formData.motoPlate}
                      onChange={(e) => setFormData({...formData, motoPlate: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="problemDescription">Описание проблемы *</Label>
                  <Textarea
                    id="problemDescription"
                    placeholder="Опишите, что случилось: поломка, ДТП, нужна эвакуация и т.д."
                    value={formData.problemDescription}
                    onChange={(e) => setFormData({...formData, problemDescription: e.target.value})}
                    rows={4}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border-2 border-orange/30 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="MapPin" className="w-6 h-6 text-orange" />
                <h2 className="text-xl font-bold">Местоположение</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="location">Адрес или координаты *</Label>
                  <Input
                    id="location"
                    placeholder="Укажите адрес или координаты"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                >
                  <Icon name="Navigation" className="w-5 h-5 mr-2" />
                  {isLoadingLocation ? "Получение координат..." : "Определить мое местоположение"}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-orange hover:bg-orange/90" size="lg">
              <Icon name="Send" className="w-5 h-5 mr-2" />
              Отправить заявку
            </Button>
          </form>

          <div className="mt-8 bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground text-center">
              💡 После отправки заявки с вами свяжется оператор службы помощи
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
