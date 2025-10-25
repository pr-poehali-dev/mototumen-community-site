import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const Terms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <Icon name="ArrowLeft" className="h-4 w-4 mr-2" />
          Назад
        </Button>

        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Oswald, sans-serif' }}>
          Пользовательское соглашение
        </h1>

        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Общие положения</h2>
            <p>
              Настоящее Пользовательское соглашение (далее — Соглашение) регулирует отношения между 
              администрацией сайта МОТОТюмень (далее — Сайт) и пользователями Сайта.
            </p>
            <p className="mt-2">
              Регистрируясь и используя Сайт, вы принимаете условия настоящего Соглашения в полном объеме.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Регистрация и учетные записи</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Регистрация на Сайте осуществляется через Telegram</li>
              <li>Вы обязуетесь предоставлять достоверную информацию о себе</li>
              <li>Вы несете ответственность за сохранность данных своей учетной записи</li>
              <li>Запрещается создание нескольких аккаунтов одним лицом</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Правила поведения</h2>
            <p>При использовании Сайта запрещается:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Публиковать оскорбительный, дискриминационный или незаконный контент</li>
              <li>Размещать спам и рекламу без согласования с администрацией</li>
              <li>Нарушать авторские права третьих лиц</li>
              <li>Использовать Сайт в мошеннических целях</li>
              <li>Осуществлять действия, нарушающие работу Сайта</li>
              <li>Распространять вредоносное программное обеспечение</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Контент пользователей</h2>
            <p>
              Размещая контент на Сайте (объявления, комментарии, фото), вы:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Гарантируете, что обладаете всеми необходимыми правами на размещаемый контент</li>
              <li>Предоставляете Сайту право на использование, хранение и отображение вашего контента</li>
              <li>Соглашаетесь с тем, что администрация может модерировать и удалять контент</li>
              <li>Несете полную ответственность за размещаемую информацию</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Объявления и сделки</h2>
            <p>
              Сайт является площадкой для размещения объявлений и не несет ответственности за:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Достоверность информации в объявлениях</li>
              <li>Качество товаров и услуг</li>
              <li>Исполнение обязательств между пользователями</li>
              <li>Споры, возникающие между покупателями и продавцами</li>
            </ul>
            <p className="mt-2">
              Все сделки осуществляются напрямую между пользователями на их собственный риск.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Интеллектуальная собственность</h2>
            <p>
              Все материалы Сайта (дизайн, логотипы, тексты, графика) являются собственностью администрации 
              и защищены законодательством об авторском праве.
            </p>
            <p className="mt-2">
              Использование материалов Сайта без письменного разрешения администрации запрещено.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Ответственность</h2>
            <p>
              Администрация Сайта не несет ответственности за:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Временную недоступность Сайта по техническим причинам</li>
              <li>Действия третьих лиц на Сайте</li>
              <li>Убытки, возникшие в результате использования или невозможности использования Сайта</li>
              <li>Контент, размещаемый пользователями</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Модерация и блокировка</h2>
            <p>
              Администрация имеет право без предупреждения:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Удалять контент, нарушающий настоящее Соглашение</li>
              <li>Блокировать учетные записи пользователей</li>
              <li>Ограничивать доступ к функциям Сайта</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Изменения в Соглашении</h2>
            <p>
              Администрация оставляет за собой право вносить изменения в настоящее Соглашение. 
              Актуальная версия всегда доступна на этой странице.
            </p>
            <p className="mt-2">
              Продолжая использовать Сайт после внесения изменений, вы соглашаетесь с новой редакцией Соглашения.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Контакты</h2>
            <p>
              По всем вопросам, связанным с работой Сайта, обращайтесь в Telegram канал{' '}
              <a href="https://t.me/MotoTyumen" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                @MotoTyumen
              </a>
            </p>
          </section>

          <div className="pt-6 border-t border-border mt-8">
            <p className="text-sm">
              Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
