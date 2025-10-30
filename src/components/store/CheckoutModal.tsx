import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface CheckoutModalProps {
  cartTotal: number;
  deliveryMethod: 'pickup' | 'delivery';
  onClose: () => void;
  onSubmit: (data: CheckoutData) => void;
}

export interface CheckoutData {
  name: string;
  phone: string;
  address: string;
  comment: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cartTotal,
  deliveryMethod,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CheckoutData>({
    name: '',
    phone: '',
    address: '',
    comment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-[#004488]/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-900 border-b border-[#004488]/20 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Оформление заказа</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Имя и фамилия</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Иван Иванов"
              className="bg-dark-800 border-[#004488]/20 focus:border-[#004488]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Телефон</label>
            <Input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+7 (999) 123-45-67"
              className="bg-dark-800 border-[#004488]/20 focus:border-[#004488]"
            />
          </div>

          {deliveryMethod === 'delivery' && (
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Адрес доставки</label>
              <Textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Улица, дом, квартира"
                className="bg-dark-800 border-[#004488]/20 focus:border-[#004488] min-h-[80px]"
              />
            </div>
          )}

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Комментарий к заказу</label>
            <Textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Дополнительная информация"
              className="bg-dark-800 border-[#004488]/20 focus:border-[#004488] min-h-[80px]"
            />
          </div>

          <div className="bg-dark-800/50 rounded-lg p-4 border border-[#004488]/20">
            <div className="flex justify-between text-gray-400 mb-2">
              <span>Способ получения:</span>
              <span className="text-white">
                {deliveryMethod === 'pickup' ? 'Самовывоз' : 'Доставка'}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold text-white">
              <span>Итого к оплате:</span>
              <span>{cartTotal.toLocaleString()} ₽</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
            >
              <Icon name="Check" size={18} className="mr-2" />
              Подтвердить заказ
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#004488]/50 hover:bg-[#004488]/10"
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
