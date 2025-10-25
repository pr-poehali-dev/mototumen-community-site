import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const Disclaimer: React.FC = () => {
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
          Отказ от ответственности
        </h1>

        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Общая информация</h2>
            <p>
              Сайт МОТОТюмень (далее — Сайт) является информационной площадкой для общения мотолюбителей, 
              размещения объявлений и информации о мероприятиях.
            </p>
            <p className="mt-2">
              Администрация Сайта не является организатором мероприятий, продавцом товаров или услуг, 
              размещенных на Сайте пользователями.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Пользовательский контент</h2>
            <p>
              Вся информация, размещаемая пользователями (объявления, комментарии, фотографии, описания товаров и услуг), 
              публикуется от имени пользователей и является их личной ответственностью.
            </p>
            <p className="mt-2 font-semibold text-foreground">
              Администрация Сайта НЕ НЕСЕТ ОТВЕТСТВЕННОСТИ за:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Достоверность информации в объявлениях и публикациях пользователей</li>
              <li>Качество, безопасность и законность товаров и услуг, предлагаемых пользователями</li>
              <li>Соблюдение пользователями условий сделок</li>
              <li>Любые убытки, возникшие в результате сделок между пользователями</li>
              <li>Контент, нарушающий права третьих лиц, размещенный пользователями</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Сделки купли-продажи</h2>
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-4">
              <p className="font-semibold text-yellow-600 dark:text-yellow-400 flex items-start gap-2">
                <Icon name="AlertTriangle" className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>ВАЖНО: Все сделки осуществляются напрямую между покупателем и продавцом на их собственный риск!</span>
              </p>
            </div>
            <p>
              Администрация Сайта не является стороной сделок и не выступает посредником. 
              Сайт предоставляет только площадку для размещения информации.
            </p>
            <p className="mt-2">
              Перед совершением покупки рекомендуем:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Проверить продавца и запросить документы на товар</li>
              <li>Осмотреть товар лично перед оплатой</li>
              <li>Не переводить предоплату незнакомым лицам</li>
              <li>Оформлять сделки договором купли-продажи</li>
              <li>Сохранять переписку и чеки</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Мероприятия</h2>
            <p>
              Информация о мероприятиях размещается пользователями или партнерами. 
              Администрация Сайта не организует мероприятия и не несет ответственности за:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Проведение, отмену или изменение условий мероприятий</li>
              <li>Безопасность участников мероприятий</li>
              <li>Действия организаторов и других участников</li>
              <li>Качество услуг, предоставляемых на мероприятиях</li>
            </ul>
            <p className="mt-4 font-semibold text-foreground">
              Участие в мероприятиях — на ваш собственный риск. Соблюдайте ПДД и технику безопасности!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Внешние ссылки</h2>
            <p>
              Сайт может содержать ссылки на внешние ресурсы (социальные сети, сайты партнеров, магазины). 
              Администрация не контролирует содержание этих сайтов и не несет ответственности за информацию на них.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Техническая доступность</h2>
            <p>
              Администрация стремится обеспечить бесперебойную работу Сайта, но не гарантирует:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Отсутствие технических сбоев и ошибок</li>
              <li>Постоянную доступность всех функций</li>
              <li>Сохранность данных при технических сбоях</li>
              <li>Совместимость со всеми устройствами и браузерами</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Модерация контента</h2>
            <p>
              Администрация осуществляет модерацию контента на добровольной основе и удаляет 
              явные нарушения (спам, оскорбления, незаконный контент).
            </p>
            <p className="mt-2">
              Однако администрация НЕ ОБЯЗАНА проверять весь контент до публикации и не несет ответственности 
              за временное присутствие на Сайте недостоверной или незаконной информации.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Интеллектуальная собственность</h2>
            <p>
              Пользователи несут ответственность за соблюдение авторских прав при публикации материалов. 
              Администрация не проверяет наличие прав на размещаемый контент.
            </p>
            <p className="mt-2">
              Если вы обнаружили нарушение ваших авторских прав — сообщите об этом администрации для удаления контента.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Рекомендации и советы</h2>
            <p>
              Любые советы, рекомендации и мнения, высказанные пользователями на Сайте, 
              являются личной позицией авторов и не являются профессиональной консультацией.
            </p>
            <p className="mt-2">
              Для получения профессиональной помощи обращайтесь к квалифицированным специалистам 
              (юристам, механикам, инструкторам).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Безопасность дорожного движения</h2>
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="font-semibold text-red-600 dark:text-red-400 flex items-start gap-2">
                <Icon name="AlertCircle" className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>
                  Администрация настоятельно рекомендует соблюдать ПДД, использовать защитную экипировку 
                  и не превышать скорость. Мы НЕ пропагандируем опасное вождение и нарушение правил.
                </span>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Жалобы и претензии</h2>
            <p>
              Если вы обнаружили на Сайте незаконный контент, мошенничество или нарушения — 
              сообщите об этом администрации через Telegram канал{' '}
              <a href="https://t.me/MotoTyumen" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                @MotoTyumen
              </a>
            </p>
            <p className="mt-2">
              Претензии по качеству товаров/услуг направляйте напрямую продавцам и исполнителям.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Изменения в документе</h2>
            <p>
              Администрация оставляет за собой право вносить изменения в настоящий документ. 
              Актуальная версия всегда доступна на этой странице.
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

export default Disclaimer;
