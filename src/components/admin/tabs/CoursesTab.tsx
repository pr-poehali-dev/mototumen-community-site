import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icon from "@/components/ui/icon";
import { Course } from "../types";

interface CoursesTabProps {
  courses: Course[];
  onDelete: (id: string) => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({
  courses,
  onDelete,
}) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Управление курсами</h3>
        <Button className="bg-accent hover:bg-accent/90">
          <Icon name="Plus" className="h-4 w-4 mr-2" />
          Добавить курс
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{course.title}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Icon name="MoreHorizontal" className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                    <DropdownMenuItem>
                      <Icon name="Edit" className="h-4 w-4 mr-2" />
                      Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(course.id)}
                      className="text-red-400"
                    >
                      <Icon name="Trash2" className="h-4 w-4 mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="text-zinc-400">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-accent">
                    ₽{course.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-zinc-400">
                    • {course.duration}
                  </span>
                </div>
                <Badge variant={course.available ? "default" : "destructive"}>
                  {course.available ? "Доступен" : "Недоступен"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
