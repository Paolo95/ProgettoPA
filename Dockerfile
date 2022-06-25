FROM postgres:latest
WORKDIR /usr/src
ADD /database/database_seeding.sql /docker-entrypoint-initdb.d
