import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const DOCUMENTS_KEY = 'legal_documents';

interface Document {
  id: string;
  title: string;
  content: string;
  icon: string;
}

const DEFAULT_DOCUMENTS: Document[] = [
  {
    id: 'privacy',
    title: 'Политика конфиденциальности',
    icon: 'Shield',
    content: `# Политика конфиденциальности

Последнее обновление: ${new Date().toLocaleDateString('ru-RU')}

## 1. Сбор информации
Мы собираем информацию, которую вы предоставляете при регистрации и использовании нашего сервиса.

## 2. Использование данных
Ваши данные используются для предоставления и улучшения наших услуг.

## 3. Защита данных
Мы применяем современные методы защиты ваших персональных данных.

## 4. Cookies
Наш сайт использует cookies для улучшения работы и анализа посещаемости.

## 5. Контакты
По вопросам конфиденциальности: support@example.com`
  },
  {
    id: 'terms',
    title: 'Пользовательское соглашение',
    icon: 'FileText',
    content: `# Пользовательское соглашение

Последнее обновление: ${new Date().toLocaleDateString('ru-RU')}

## 1. Принятие условий
Используя наш сервис, вы соглашаетесь с данными условиями.

## 2. Права пользователя
Вы имеете право использовать наш сервис в соответствии с законодательством.

## 3. Обязанности пользователя
Вы обязуетесь не нарушать правила использования сервиса.

## 4. Ответственность
Мы не несём ответственности за действия пользователей.

## 5. Изменения условий
Мы оставляем за собой право изменять данное соглашение.`
  },
  {
    id: 'disclaimer',
    title: 'Отказ от ответственности',
    icon: 'AlertTriangle',
    content: `# Отказ от ответственности

Последнее обновление: ${new Date().toLocaleDateString('ru-RU')}

## 1. Общая информация
Информация на сайте предоставляется "как есть" без каких-либо гарантий.

## 2. Ограничение ответственности
Мы не несём ответственности за убытки, возникшие в результате использования сервиса.

## 3. Внешние ссылки
Мы не контролируем содержимое внешних сайтов и не несём за них ответственность.

## 4. Точность информации
Мы стремимся поддерживать актуальность информации, но не гарантируем её абсолютную точность.

## 5. Изменения
Данный документ может быть изменён без предварительного уведомления.`
  }
];

export const AdminDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(DOCUMENTS_KEY);
    if (saved) {
      setDocuments(JSON.parse(saved));
    } else {
      setDocuments(DEFAULT_DOCUMENTS);
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(DEFAULT_DOCUMENTS));
    }
  }, []);

  const handleEdit = (doc: Document) => {
    setEditingId(doc.id);
    setEditContent(doc.content);
  };

  const handleSave = () => {
    if (!editingId) return;

    const updated = documents.map(doc =>
      doc.id === editingId ? { ...doc, content: editContent } : doc
    );

    setDocuments(updated);
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(updated));
    
    setEditingId(null);
    setEditContent('');

    toast({
      title: 'Сохранено',
      description: 'Документ успешно обновлён',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleReset = (docId: string) => {
    if (!confirm('Точно сбросить документ к настройкам по умолчанию?')) return;

    const defaultDoc = DEFAULT_DOCUMENTS.find(d => d.id === docId);
    if (!defaultDoc) return;

    const updated = documents.map(doc =>
      doc.id === docId ? defaultDoc : doc
    );

    setDocuments(updated);
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(updated));

    toast({
      title: 'Сброшено',
      description: 'Документ восстановлен к настройкам по умолчанию',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Юридические документы</h2>
        <p className="text-muted-foreground">
          Редактируй содержимое документов, которые показываются пользователям
        </p>
      </div>

      <div className="grid gap-6">
        {documents.map(doc => (
          <Card key={doc.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name={doc.icon as any} className="w-6 h-6 text-accent" />
                  <div>
                    <CardTitle>{doc.title}</CardTitle>
                    <CardDescription>
                      Доступен по адресу: /{doc.id}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  {editingId !== doc.id && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(doc)}
                      >
                        <Icon name="Pencil" className="w-4 h-4 mr-2" />
                        Редактировать
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReset(doc.id)}
                      >
                        <Icon name="RotateCcw" className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingId === doc.id ? (
                <div className="space-y-4">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                    placeholder="Содержимое документа (Markdown)"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={handleCancel}>
                      Отмена
                    </Button>
                    <Button onClick={handleSave}>
                      <Icon name="Save" className="w-4 h-4 mr-2" />
                      Сохранить
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap text-xs bg-muted p-4 rounded-lg max-h-[200px] overflow-auto">
                    {doc.content}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
