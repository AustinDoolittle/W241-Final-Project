FROM postgres:9.6.17

COPY ./db/init_tables.sql /docker-entrypoint-initdb.d/