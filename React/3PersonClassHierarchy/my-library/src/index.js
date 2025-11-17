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

// Instances
const student = new Student("Pankaj", 21, "Computer Science");
const teacher = new Teacher("Mr. Verma", 45, "Mathematics");

console.log(student.getInfo());
console.log(teacher.getInfo());
