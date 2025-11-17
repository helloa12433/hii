import React from "react";

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getInfo() {
    return `Name: ${this.name}, Age: ${this.age}`;
  }
}

class Student extends Person {
  constructor(name, age, course) {
    super(name, age);
    this.course = course;
  }

  getInfo() {
    return `${super.getInfo()}, Course: ${this.course}`;
  }
}

class Teacher extends Person {
  constructor(name, age, department) {
    super(name, age);
    this.department = department;
  }

  getInfo() {
    return `${super.getInfo()}, Department: ${this.department}`;
  }
}

export default function App() {
  const student = new Student("Pankaj", 21, "Computer Science");
  const teacher = new Teacher("Mr. Verma", 45, "Mathematics");

  return (
    <div style={{ padding: "20px", fontSize: "18px" }}>
      <h2>Practice 3 – Class Inheritance Demo</h2>

      <p><strong>Student:</strong> {student.getInfo()}</p>
      <p><strong>Teacher:</strong> {teacher.getInfo()}</p>
    </div>
  );
}
