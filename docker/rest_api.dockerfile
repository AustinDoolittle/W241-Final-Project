ARG FLASK_ENV

FROM python:3.9.0a4-alpine3.10

# setup python
COPY ./rest_api /app
RUN pip install -r /app/requirements.txt

ENV FLASK_APP="/app/src/endpoint.py"
WORKDIR /app

ENTRYPOINT [ "python" ]
CMD [ "-m", "flask", "run", "-h", "0.0.0.0", "-p", "5000"]
