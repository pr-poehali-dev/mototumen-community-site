import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import ReactMarkdown from 'react-markdown';

const Terms: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('legal_documents');
    if (saved) {
      const docs = JSON.parse(saved);
      const termsDoc = docs.find((d: any) => d.id === 'terms');
      if (termsDoc) {
        setContent(termsDoc.content);
      }
    }
  }, []);

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

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Terms;
