import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const Privacy: React.FC = () => {
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
          Политика конфиденциальности
        </h1>

        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Общие положения</h2>
            <p>
              Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных 
              пользователей сайта МОТОТюмень (далее — Сайт).
            </p>
            <p className="mt-2">
              Используя Сайт, вы даете согласие на обработку ваших персональных данных в соответствии с настоящей Политикой.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Какие данные мы собираем</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Данные Telegram аккаунта (имя, username, фото профиля) при авторизации через Telegram</li>
              <li>Email адрес (при регистрации)</li>
              <li>Информация о мотоцикле (марка, модель, год) — по желанию</li>
              <li>Город проживания</li>
              <li>Данные о действиях на сайте (объявления, комментарии, участие в мероприятиях)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Как мы используем данные</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Для идентификации пользователей и обеспечения работы личного кабинета</li>
              <li>Для связи с вами по вопросам работы Сайта</li>
              <li>Для публикации объявлений и информации о мероприятиях</li>
              <li>Для улучшения работы Сайта и пользовательского опыта</li>
              <li>Для модерации контента и обеспечения безопасности</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Защита данных</h2>
            <p>
              Мы применяем технические и организационные меры для защиты ваших персональных данных от 
              несанкционированного доступа, изменения, раскрытия или уничтожения.
            </p>
            <p className="mt-2">
              Доступ к персональным данным имеют только уполномоченные сотрудники, которые обязаны соблюдать конфиденциальность.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Передача данных третьим лицам</h2>
            <p>
              Мы не продаем и не передаем ваши персональные данные третьим лицам, за исключением случаев:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>С вашего явного согласия</li>
              <li>По требованию законодательства или государственных органов</li>
              <li>Для обеспечения работы сервисов (Telegram API, хостинг)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Ваши права</h2>
            <p>Вы имеете право:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Запросить доступ к своим персональным данным</li>
              <li>Исправить или удалить свои данные</li>
              <li>Отозвать согласие на обработку данных</li>
              <li>Ограничить обработку данных</li>
            </ul>
            <p className="mt-2">
              Для реализации этих прав обратитесь к администратору Сайта через Telegram канал.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Файлы cookies</h2>
            <p>
              Сайт использует cookies для обеспечения работы авторизации и улучшения пользовательского опыта. 
              Вы можете отключить cookies в настройках браузера, но это может ограничить функциональность Сайта.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Изменения в Политике</h2>
            <p>
              Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности. 
              Актуальная версия всегда доступна на этой странице.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Контакты</h2>
            <p>
              По вопросам обработки персональных данных обращайтесь в Telegram канал{' '}
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

export default Privacy;
