FROM postgres:9.6.17

COPY ./docker/files/init_tables.sql /docker-entrypoint-initdb.d/