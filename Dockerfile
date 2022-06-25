FROM postgres:latest
WORKDIR /usr/src

#COPY /database/database_seeding.sql .
ADD /database/database_seeding.sql /docker-entrypoint-initdb.d
