# Testing Platform

A simple platform for administering multiple choice questions based on class and subjects.

## Features

- Supports admin and student user roles
- Admin can create students, subjects, and questions
- Answers are automatically marked and scored immediately after the test is submited.

## Architecture

This section describes how the app will be structured and designed.

### Data Schemas

All schemas have timestamps for last modified and time created.

- user schema

```json
{
  "id": "integer",
  "first_name": "string",
  "middle_name": "string",
  "last_name": "string",
  "username": "string", // unique
  "password": "string", // /encrypted
  "classes": ["string"], // linked to added class in class schema (optional, not required for admin users)
  "subjects": ["string"], // linked to added subject in subject schema (optional, not required for admin users)
  "role": "admin | student"
}
```

- subject schema

```json
{
  "id": "integer",
  "name": "string",
  "class": "string", // linked to a class in the class schema
  "description": "string"
}
```

- class schema

```json
{
  "id": "integer",
  "name": "string",
  "description": "string"
}
```

- question_option schema

```json
{
  "id": "integer",
  "text": "string",
  "image_url": "string", // url for the image to be displayed as an option in a question
  "questionId": "int"
}
```

- question schema

```json
{
  "id": "integer",
  "correctOptionId": "option id", // don't include this is the payload that is sent to the client, so that when all the questions have been answered, it can be verified only on the server.
  "options": ["question_option"],
  "subjectId": "int",
  "explanation": "string",
  "explanationImageUrl": "string"
}
```

- test schema
  Every new test should be recorded for history purpose

```json
{
  "id": "integer",
  "subjectId": "int", // linked to added subject in subject schema (optional, not required for admin users)
  "classId": "string", // linked to a class in the class schema
  "score": "integer",
  "questions": ["question"]
}
```

### Database Management

- For database manegement, use SQL (prefer SQLite3)
- ORM, use Prisma

### Authentication/Authorization

Use session and cookies

### Frontend

- Framework => React, with vite
- State management => context
- Routing => React router
