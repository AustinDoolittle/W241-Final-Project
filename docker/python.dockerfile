FROM python:3.9.0a4-alpine3.10

COPY ./rest_api /app

RUN \
    apk add --no-cache postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
    python3 -m pip install -r /app/requirements.txt --no-cache-dir && \
    apk --purge del .build-deps

ENV FLASK_APP="/app/src/endpoint.py"
WORKDIR /app

CMD [ "gunicorn", "-w", "2", "-b", "0.0.0.0:5000", "src.endpoint:app"]
