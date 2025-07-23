import { useState } from "react";
import { Course } from "../types";

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Курс для начинающих",
      description: "Обучение с опытными инструкторами",
      price: 25000,
      duration: "40 часов",
      category: "basic",
      available: true,
    },
    {
      id: "2",
      title: "Повышение категории",
      description: "Подготовка к получению категории A",
      price: 15000,
      duration: "20 часов",
      category: "advanced",
      available: true,
    },
  ]);

  const saveCourse = (course: Course) => {
    if (course.id) {
      setCourses(courses.map((c) => (c.id === course.id ? course : c)));
    } else {
      setCourses([...courses, { ...course, id: Date.now().toString() }]);
    }
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  return {
    courses,
    saveCourse,
    deleteCourse,
  };
};
