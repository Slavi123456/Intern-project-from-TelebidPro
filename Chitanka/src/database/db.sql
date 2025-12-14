CREATE DATABASE chitanka_project;


CREATE TABLE countries (
    id INT  GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

CREATE TABLE authors (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_id INT REFERENCES countries(id)
);

CREATE TABLE author_stats (
    author_id INT PRIMARY KEY REFERENCES authors(id),
    unique_words INT NOT NULL,
    avg_words_per_sentence NUMERIC NOT NULL
);


CREATE TABLE books (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL REFERENCES authors(id)
);


CREATE TABLE book_stats (
    book_id INT PRIMARY KEY REFERENCES books(id),
    unique_words INT NOT NULL
);



