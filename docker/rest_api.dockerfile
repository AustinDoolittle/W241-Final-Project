ARG FLASK_ENV

FROM python:3.9.0a4-alpine3.10

COPY ./rest_api /app

RUN \
    apk add --no-cache postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
    python3 -m pip install -r /app/requirements.txt --no-cache-dir && \
    apk --purge del .build-deps

ENV FLASK_APP="/app/src/endpoint.py"
WORKDIR /app

ENTRYPOINT [ "python" ]
CMD [ "-m", "flask", "run", "-h", "0.0.0.0", "-p", "5000"]
